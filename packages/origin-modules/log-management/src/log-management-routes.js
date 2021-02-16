const routes = [
  {
    path: 'log-management/:id?',
    name: 'logManagement',
    component: () => import(/* webpackChunkName: "masters" */ './views/LogMasters.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
