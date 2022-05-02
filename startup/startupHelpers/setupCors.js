const setupCors = (res, req) => {
  const origin = req.getHeader('origin');

  res.writeHeader('Access-Control-Allow-Origin', `${origin}`)
    .writeHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    .writeHeader('Access-Control-Allow-Headers', 'origin, content-type, accept,'
      + ' x-requested-with, authorization, lang, domain-key')
    .writeHeader('Access-Control-Max-Age', '3600')
    .writeHeader('Access-Control-Allow-Credentials', 'true');
};

export default setupCors;
