const routes = [
  {
    path: 'production-layout',
    name: 'productionLayout',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ProductionLayout.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
