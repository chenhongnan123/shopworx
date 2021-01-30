const routes = [
  {
    path: 'production-layout-mes',
    name: 'productionLayoutMes',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ProductionLayout.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
