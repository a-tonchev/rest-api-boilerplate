import SystemSettingsServices from '#modules/systemSettings/SystemSettingsServices';

// Allow-list driven by settings rather than reflecting whatever Origin the
// client sent. Reflecting an arbitrary origin together with
// Access-Control-Allow-Credentials makes every authenticated endpoint callable
// from any page on the internet.
const { frontendUrl } = SystemSettingsServices.getSettings() || {};
const allowedOrigins = new Set([frontendUrl].filter(Boolean));

const ALLOWED_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOWED_HEADERS = 'origin, content-type, accept, x-requested-with,'
  + ' authorization, lang, domain-key';

// NOTE: must be called AFTER res.writeStatus() — in uWS the first writeHeader
// implicitly commits the status as "200 OK" if none was written yet.
const setupCors = (res, origin) => {
  // Only echo the origin (and allow credentials) for an allow-listed origin.
  if (origin && allowedOrigins.has(origin)) {
    res.writeHeader('Access-Control-Allow-Origin', origin)
      .writeHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.writeHeader('Access-Control-Allow-Methods', ALLOWED_METHODS)
    .writeHeader('Access-Control-Allow-Headers', ALLOWED_HEADERS)
    .writeHeader('Access-Control-Max-Age', '600')
    .writeHeader('Vary', 'Origin');
};

export default setupCors;
