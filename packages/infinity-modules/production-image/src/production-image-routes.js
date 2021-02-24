const routes = [
  {
    path: 'production-image',
    name: 'productionImage',
    component: () => import(/* webpackChunkName: "production-image" */ './views/ProductionImage.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
