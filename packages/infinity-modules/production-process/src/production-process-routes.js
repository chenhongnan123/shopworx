const routes = [
  {
    path: 'production-process',
    name: 'productionProcess',
    component: () => import(/* webpackChunkName: "parameter-configuration" */ './views/ProductionProcess.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
