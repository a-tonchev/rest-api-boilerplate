import setupCors from '../../startupHelpers/setupCors';

const setupNotFoundRoute = app => {
  app.any('/*', (res, req) => {
    let isAborted = false;

    res.onAborted(() => {
      console.error('ABORTED!');
      isAborted = true;
    });

    try {
      const origin = req.getHeader('origin');
      setupCors(res, origin);

      if (!isAborted) {
        res
          .writeStatus('404')
          .end('Route does not exist!');
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export default setupNotFoundRoute;
