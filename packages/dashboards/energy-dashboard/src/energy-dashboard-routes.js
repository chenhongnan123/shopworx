const routes = [
  {
    path: 'energy-dashboard',
    component: () => import(/* webpackChunkName: "energy-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'energyDashboard',
        component: () => import(/* webpackChunkName: "energy-dashboard" */ './views/ShopfloorView.vue'),
      },
      {
        path: ':id',
        name: 'assetDetail',
        component: () => import(/* webpackChunkName: "energy-dashboard-asset" */ './views/AssetView.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
