const routes = [
  {
    path: 'user-dashboard',
    name: 'home',
    component: () => import(/* webpackChunkName: "user-dashboard" */ './views/UserDashboard.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
