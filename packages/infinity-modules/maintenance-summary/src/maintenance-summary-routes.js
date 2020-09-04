const routes = [
  {
    path: 'maintenance-summary',
    name: 'maintenanceSummary',
    component: () => import(/* webpackChunkName: "maintenance-summary" */ './views/MaintenanceSummary.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
