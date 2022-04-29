import ipaddr from 'ipaddr.js';

import ContextError from './ContextError';
import jsonParser from './jsonParser';
import setupUserAgent from './setupUserAgent';

const setupContext = async (req, res) => {
  const ctx = ({
    privateState: {
      user: null,
    },
    state: {},
    body: '',
    request: {
      header: {},
      body: {},
      ipv6: '',
      ip: '',
    },
    userAgent: {
      _agent: {},
    },
    throw: errorData => {
      throw new ContextError(errorData);
    },
  });

  // Setup Headers
  req.forEach((k, v) => {
    ctx.request.header[k] = v;
  });

  [ctx.request.body, ctx.request.rawBody] = await jsonParser(res) || [{}, ''];

  try {
    const ipArrayBuffer = res.getRemoteAddress();

    /** @type {any} * */
    const binaryArray = new Uint8Array(ipArrayBuffer);

    /** @type { IPv6 | any } */
    const ipAddress = ipaddr.fromByteArray(binaryArray);

    ctx.request.ipv6 = ipAddress.toString();
    ctx.request.ip = ipAddress.toIPv4Address().toString();
  } catch (e) {
    console.error('Can not get ip address');
    console.error(e);
  }

  setupUserAgent(ctx);

  return ctx;
};

export default setupContext;
