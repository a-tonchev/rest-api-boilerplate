import setupContext from '../../startupHelpers/setupContext';
import routes from '../routes';
import setupCors from '../../startupHelpers/setupCors';
import setupServicesAndSteps from './setupServicesAndSteps';

const setupRouteHandlers = (app, mongoSetup) => {
  routes.forEach(route => {
    const { path, method, steps } = route;

    app[method](path, (res, req) => {
      let isAborted = false;
      let responded = false;

      // Single onAborted registration for the whole request. It flips the flag
      // AND signals the body parser so a mid-body disconnect settles instead of
      // leaking a pending promise.
      const abortController = new AbortController();
      res.onAborted(() => {
        isAborted = true;
        abortController.abort();
      });

      // Read request-only fields synchronously; `req` is invalid after the first
      // await in uWS.
      const origin = req.getHeader('origin');

      const handleRequest = async () => {
        let ctx = await setupContext(req, res, path, abortController.signal);

        await setupServicesAndSteps(ctx, mongoSetup, steps);

        if (!isAborted) {
          res.cork(() => {
            res.writeStatus(`${ctx.status || 400}`);
            setupCors(res, origin);
            res.writeHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(
              typeof ctx.body === 'object' ? JSON.stringify(ctx.body) : ctx.body,
            );
            responded = true;
          });
        }

        // Background work runs AFTER the response. Isolate each item so one bad
        // task cannot reject into the outer boundary and attempt a second write.
        for (const promiseElement of ctx.waitFor) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await promiseElement;
          } catch (waitError) {
            console.error('waitFor task failed:', waitError);
          }
        }

        for (const functionToExecute of ctx.executeAfterFinish) {
          try {
            if (functionToExecute.constructor.name === 'AsyncFunction') {
              // eslint-disable-next-line no-await-in-loop
              await functionToExecute();
            } else {
              functionToExecute();
            }
          } catch (finishError) {
            console.error('executeAfterFinish task failed:', finishError);
          }
        }

        ctx = null;
      };

      // Real catchable boundary: the async work is awaited here, so parser
      // errors (oversized/aborted body) and any pipeline rejection are handled
      // instead of becoming a process-killing unhandled rejection.
      handleRequest().catch(error => {
        if (error?.isAbort || isAborted) {
          // Client is gone (or the body was aborted) — nothing writable to answer.
          return;
        }

        if (responded) {
          // The response was already sent; a later failure can only be logged.
          console.error('Post-response pipeline error:', error);
          return;
        }

        const { statusCode, body } = error?.errorData || {};

        res.cork(() => {
          res.writeStatus(`${statusCode || 500}`);
          setupCors(res, origin);
          res.writeHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify(body || { ok: false, code: 'SERVER_ERROR', data: {} }));
          responded = true;
        });
      });
    });
  });
};

export default setupRouteHandlers;
