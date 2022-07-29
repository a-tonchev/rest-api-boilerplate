import ipaddr from 'ipaddr.js';

import ContextError from './ContextError';
import jsonParser from './jsonParser';
import setupUserAgent from './setupUserAgent';

const qsToObject = qs => {
  try {
    return Object.fromEntries(new URLSearchParams(qs));
  } catch (e) {
    console.error(e);
    return {};
  }
};

const getParameters = (req, res, path) => {
  const params = {};

  if (req.getMethod() !== 'get' || !path.includes('/:')) return params;

  let paramsIndex = 0;

  for (const name of path.split('/')) {
    if (name[0] === ':') {
      params[name.substring(1)] = req.getParameter(paramsIndex);
      paramsIndex++;
    }
  }

  return params;
};

const getIpFromBuffer = ipArrayBuffer => {
  const ips = { ipv6: '', ip: '' };

  if (!ipArrayBuffer.byteLength) return ips;

  try {
    /** @type {any} * */
    const binaryArray = new Uint8Array(ipArrayBuffer);

    /** @type { IPv6 | any } */
    const ipAddress = ipaddr.fromByteArray(binaryArray);

    ips.ipv6 = ipAddress.toString();
    if (ips.ipv6 === '::1') {
      ips.ip = '127.0.0.1';
    } else {
      ips.ip = ipAddress.toIPv4Address().toString();
    }
  } catch (e) {
    console.error('Can not get ip address');
    console.error(e);
  }

  return ips;
};

const setupContext = async (req, res, path) => {
  const queryString = req.getQuery();

  const ctx = ({
    privateState: {
      user: null,
    },
    secure: true,
    state: {},
    body: '',
    params: getParameters(req, res, path),
    waitFor: [],
    executeAfterFinish: [],
    request: {
      header: {},
      body: {},
      ip: '',
      url: req.getUrl(),
      query: queryString ? qsToObject(queryString) : {},
    },
    userAgent: {
      _agent: {},
    },
    throw: errorData => {
      throw new ContextError(errorData);
    },
  });

  ctx.addToWait = newPromise => ctx.waitFor.push(newPromise);
  ctx.addToExecuteOnFinish = newFunction => ctx.executeAfterFinish.unshift(newFunction);

  // Setup Headers
  req.forEach((k, v) => {
    ctx.request.header[k] = v;
  });

  [ctx.request.body, ctx.request.rawBody] = await jsonParser(res) || [{}, ''];

  ctx.request.ip = ctx.request.header['x-forwarded-for'];

  if (!ctx.request.ip) {
    const ipArrayBuffer = res.getRemoteAddress();
    const { ip: newIp } = getIpFromBuffer(ipArrayBuffer);

    ctx.request.ip = newIp;
  }

  setupUserAgent(ctx);

  return ctx;
};

export default setupContext;
