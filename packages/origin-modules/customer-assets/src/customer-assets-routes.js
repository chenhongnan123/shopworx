const routes = [
  {
    path: 'assets',
    name: 'customerAssets',
    component: () => import(/* webpackChunkName: "customer-assets" */ './views/CustomerAssets.vue'),
  },
];

export default routes;
