const routes = [
  {
    path: '/live-shopfloor',
    component: () => import(/* webpackChunkName: "live-shopfloor" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'liveShopfloor',
        component: () => import(/* webpackChunkName: "live-shopfloor" */ './views/ShopfloorDashboard.vue'),
      },
      {
        path: ':id',
        name: 'assetDetail',
        component: () => import(/* webpackChunkName: "live-shopfloor-asset" */ './views/AssetDashboard.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
