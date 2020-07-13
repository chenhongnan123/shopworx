const routes = [
  {
    path: 'production-planning',
    name: 'productionPlanning',
    component: () => import(/* webpackChunkName: "planning" */ './views/Planning.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
