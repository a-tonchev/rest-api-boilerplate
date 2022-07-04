import setupCors from '../../startupHelpers/setupCors';

const setupMainRoute = app => {
  app.any('/', (res, req) => {
    let isAborted = false;

    res.onAborted(() => {
      console.error('ABORTED!');
      isAborted = true;
    });

    try {
      const origin = req.getHeader('origin');
      setupCors(res, origin);

      if (!isAborted) {
        res.writeStatus('200').end('Welcome To The API!');
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export default setupMainRoute;
