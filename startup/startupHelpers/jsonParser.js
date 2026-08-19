import CustomErrors from '#modules/responseHandler/CustomErrors';
import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';

import ContextError from './ContextError';

// Configurable via settings (`maxBodyBytes`); defaults to 1 MB. This is the hard
// upper bound on a single request body; anything larger is rejected with 413
// before it can exhaust the heap.
const { maxBodyBytes } = SystemSettingsServices.getSettings() || {};
const DEFAULT_MAX_BODY_BYTES = maxBodyBytes || 1024 * 1024;

const payloadTooLargeError = () => new ContextError({
  statusCode: CustomErrors.PAYLOAD_TOO_LARGE.statusCode,
  errorMessage: CustomErrors.PAYLOAD_TOO_LARGE.message,
  body: {
    ok: false,
    code: CustomErrors.PAYLOAD_TOO_LARGE.errorCode,
    data: {},
  },
});

const requestAbortedError = () => {
  const err = new Error('Request aborted before body completed');
  err.isAbort = true;
  return err;
};

/* Helper function for reading a posted JSON body */
const jsonParser = (res, options = {}) => new Promise((resolve, reject) => {
  const { signal, maxBytes = DEFAULT_MAX_BODY_BYTES } = options;

  // Chunks are collected in an array and concatenated ONCE at the end. The old
  // per-chunk Buffer.concat was O(n^2) in bytes copied for a fragmented body.
  let chunks = [];
  let totalBytes = 0;
  let settled = false;

  const cleanup = () => {
    chunks = [];
    totalBytes = 0;
    if (signal) signal.removeEventListener('abort', onAbort);
  };

  const settle = (fn, value) => {
    if (settled) return;
    settled = true;
    cleanup();
    fn(value);
  };

  function onAbort() {
    // Client disconnected mid-body: reject so the awaiting request frame (and
    // everything it closes over — ctx, buffers, the response) is released
    // instead of leaking forever on a never-settling promise.
    settle(reject, requestAbortedError());
  }

  if (signal) {
    if (signal.aborted) {
      settle(reject, requestAbortedError());
      return;
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  res.onData((ab, isLast) => {
    if (settled) return;

    totalBytes += ab.byteLength;

    if (totalBytes > maxBytes) {
      // Stop accumulating and reject; the route handler answers 413 while the
      // socket is still writable. We do NOT res.close() here, because that would
      // fire onAborted and suppress the 413 response.
      settle(reject, payloadTooLargeError());
      return;
    }

    // Copy out of uWS' recycled ArrayBuffer before retaining the bytes across
    // onData calls (Buffer.from(ab) only creates a view; the outer copy owns it).
    chunks.push(Buffer.from(Buffer.from(ab)));

    if (isLast) {
      const rawBuffer = Buffer.concat(chunks);

      let rawBody = '';
      try {
        rawBody = rawBuffer.toString('utf8');
      } catch {
        rawBody = '';
      }

      let jsonBody;
      try {
        jsonBody = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        // Preserve existing behaviour: a malformed body becomes {} and is caught
        // downstream by schema validation.
        jsonBody = {};
      }

      settle(resolve, [jsonBody, rawBody]);
    }
  });
});

export default jsonParser;
