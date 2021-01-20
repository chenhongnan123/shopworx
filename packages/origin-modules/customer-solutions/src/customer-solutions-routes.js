const routes = [
  {
    path: 'solutions',
    name: 'customerSolutions',
    component: () => import(/* webpackChunkName: "customer-solutions" */ './views/CustomerSolutions.vue'),
  },
];

export default routes;
