const routes = [
  {
    path: 'utility-dashboard',
    component: () => import(/* webpackChunkName: "live-shopfloor" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: '',
        component: () => import(/* webpackChunkName: "live-shopfloor" */ './views/UtilityDashboard.vue'),
      },
    ],
  },
];

export default routes;
