const routes = [
  {
    path: 'production-layout-sf',
    name: 'productionLayoutSF',
    component: () => import(/* webpackChunkName: "production-layout-sf" */ './views/ProductionLayout.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
