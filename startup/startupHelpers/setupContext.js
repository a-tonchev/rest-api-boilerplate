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
    request: {
      header: {},
      body: {},
      ipv6: '',
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
    if (ctx.request.ipv6 === '::1') {
      ctx.request.ip = '127.0.0.1';
    } else {
      ctx.request.ip = ipAddress.toIPv4Address().toString();
    }
  } catch (e) {
    console.error('Can not get ip address');
    console.error(e);
  }

  setupUserAgent(ctx);

  return ctx;
};

export default setupContext;
