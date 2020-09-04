const routes = [
  {
    path: 'shopfloor-dashboard',
    component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'shopfloorDashboard',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/MachineDashboard.vue'),
      },
      {
        path: ':id',
        name: 'machine-detail',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/MachineDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
