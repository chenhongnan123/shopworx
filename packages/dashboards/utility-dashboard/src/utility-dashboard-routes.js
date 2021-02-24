const routes = [
  {
    path: 'utility-dashboard',
    component: () => import(/* webpackChunkName: "utility-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: '',
        component: () => import(/* webpackChunkName: "utility-dashboard" */ './views/UtilityDashboard.vue'),
      },
    ],
  },
];

export default routes;
