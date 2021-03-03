const routes = [
  {
    path: 'process-dashboard',
    component: () => import(/* webpackChunkName: "process-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'processDashboard',
        component: () => import(/* webpackChunkName: "process-dashboard" */ './views/ShopfloorView.vue'),
      },
    ],
  },
];

export default routes;
