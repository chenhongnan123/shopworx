const routes = [
  // {
  //   path: 'order-management',
  //   name: 'orderManagement',
  //   component: () => import(/* webpackChunkName: "planning" */ './views/Planning.vue'),
  //   meta: {
  //     permissionRequired: true,
  //   },
  // },
  // {
  //   path: ':id',
  //   name: 'order-details',
  //   component: () => import(/* webpackChunkName: "planning" */ './views/OrderDetails.vue'),
  //   props: true,
  // },
  {
    path: 'order-management',
    component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'orderManagement',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/OrderManagement.vue'),
      },
      {
        path: ':id',
        name: 'order-details',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/OrderDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
