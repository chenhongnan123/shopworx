const routes = [
  {
    path: 'users',
    name: 'customerUsers',
    component: () => import(/* webpackChunkName: "customer-users" */ './views/CustomerUsers.vue'),
  },
];

export default routes;
