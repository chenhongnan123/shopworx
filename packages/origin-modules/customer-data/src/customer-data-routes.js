const routes = [
  {
    path: 'data',
    name: 'customerData',
    component: () => import(/* webpackChunkName: "customer-data" */ './views/CustomerData.vue'),
  },
];

export default routes;
