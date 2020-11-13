const routes = [
  {
    path: 'production-log',
    name: 'productionLog',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ProductionLog.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
