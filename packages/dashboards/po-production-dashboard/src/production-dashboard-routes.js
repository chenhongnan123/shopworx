const routes = [
  {
    path: 'po-production-dashboard',
    component: () => import(/* webpackChunkName: "po-production-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'poProductionDashboard',
        component: () => import(/* webpackChunkName: "po-production-dashboard" */ './views/DashboardView.vue'),
      },
    ],
  },
];

export default routes;
