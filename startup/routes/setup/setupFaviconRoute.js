import setupCors from '../../startupHelpers/setupCors';

const setupFaviconRoute = app => {
  app.any('/favicon.icon', (res, req) => {
    let isAborted = false;

    res.onAborted(() => {
      console.error('ABORTED!');
      isAborted = true;
    });

    try {
      const origin = req.getHeader('origin');
      setupCors(res, origin);
      if (!isAborted) {
        res.writeStatus('200').end('');
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export default setupFaviconRoute;
