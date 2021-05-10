const routes = [
  {
    path: 'po-production-dashboard',
    component: () => import(/* webpackChunkName: "po-production-dashboard" */ './views/Index.vue'),
    // meta: {
    //   permissionRequired: true,
    // },
    children: [
      {
        path: 'charts',
        name: 'poProductionDashboard',
        component: () => import(/* webpackChunkName: "po-production-dashboard" */ './views/DashboardView.vue'),
      },
      {
        path: 'prediction',
        name: 'poProductionDashboard',
        component: () => import(/* webpackChunkName: "po-production-dashboard" */ './views/PredictionView.vue'),
      },
    ],
  },
];

export default routes;
