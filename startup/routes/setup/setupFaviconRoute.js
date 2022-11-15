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
      if (!isAborted) {
        res.writeStatus('200');
        setupCors(res, origin);
        res.end('');
      }
    } catch (e) {
      console.error(e);
    }
  });
};

export default setupFaviconRoute;
