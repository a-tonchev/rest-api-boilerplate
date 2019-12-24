import createBasicRoutes from '../../src/modules/routing/RouteCreator';

const DefaultRoute = createBasicRoutes({
  prefix: '/',
  routeData: [
    {
      method: 'all',
      path: '/',
      handler: ctx => ctx.body = 'Hello API!',
    },
  ],
});

export default DefaultRoute;
