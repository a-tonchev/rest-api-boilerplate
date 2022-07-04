import createBasicRoutes from '#modules/routing/createRoutes';

const DefaultRoute = createBasicRoutes({
  routeData: [
    {
      method: 'any',
      path: '/',
      handler: ctx => ctx.body = 'Hello API!',
    },
  ],
});

export default DefaultRoute;
