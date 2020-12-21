const routes = [
  {
    path: 'deployment',
    name: 'customerDeployment',
    component: () => import(/* webpackChunkName: "customer-deployment" */ './views/CustomerDeployment.vue'),
  },
];

export default routes;
