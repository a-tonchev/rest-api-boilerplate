import setupCors from '../../startupHelpers/setupCors';

const setupNotFoundRoute = app => {
  app.any('/*', (res, req) => {
    let isAborted = false;

    res.onAborted(() => {
      isAborted = true;
    });

    try {
      // Read the origin before any writeHeader; `req` stays valid here (no await).
      const origin = req.getHeader('origin');

      if (!isAborted) {
        res.cork(() => {
          // Status FIRST — otherwise the CORS writeHeader calls commit a 200 and
          // every unknown route silently answers 200 OK.
          res.writeStatus('404 Not Found');
          setupCors(res, origin);
          res.writeHeader('Content-Type', 'application/json; charset=utf-8');
          res.end('{"ok":false,"code":"NOT_FOUND","data":{}}');
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export default setupNotFoundRoute;
