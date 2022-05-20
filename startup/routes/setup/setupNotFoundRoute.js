import setupCors from '../../startupHelpers/setupCors';

const setupNotFoundRoute = app => {
  app.any('/*', (res, req) => {
    try {
      const origin = req.getHeader('origin');
      setupCors(res, origin);

      res
        .writeStatus('200')
        .end('Route does not exist!');
    } catch (e) {
      console.error(e);
    }
  });
};

export default setupNotFoundRoute;
