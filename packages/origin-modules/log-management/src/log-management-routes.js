const routes = [
  {
    path: 'logs',
    name: 'customerLogManagement',
    component: () => import(/* webpackChunkName: "customer-log-management" */ './views/LogMasters.vue'),
  },
];

export default routes;
