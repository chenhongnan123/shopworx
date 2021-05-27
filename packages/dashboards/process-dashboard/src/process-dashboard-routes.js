const routes = [
  {
    path: 'process',
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
