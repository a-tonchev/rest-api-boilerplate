const setupCors = (res, origin) => {
  res.writeHeader('Access-Control-Allow-Origin', `${origin}`)
    .writeHeader('Access-Control-Allow-Credentials', 'true')
    .writeHeader('Access-Control-Allow-Headers', 'origin, content-type, accept,'
      + ' x-requested-with, authorization, lang, domain-key')
    .writeHeader('Access-Control-Max-Age', '2592000')
    .writeHeader('Vary', 'Origin');
};

export default setupCors;
