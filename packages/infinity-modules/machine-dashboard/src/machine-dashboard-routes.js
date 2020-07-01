const routes = [
  {
    path: 'machine-dashboard',
    name: 'machineDashboard',
    component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/MachineDashboard.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
