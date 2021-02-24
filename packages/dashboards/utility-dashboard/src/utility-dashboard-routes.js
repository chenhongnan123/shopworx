const routes = [
  {
    path: 'utility',
    component: () => import(/* webpackChunkName: "utility-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'utilityDashboard',
        component: () => import(/* webpackChunkName: "utility-dashboard" */ './views/UtilityDashboard.vue'),
      },
    ],
  },
];

export default routes;
