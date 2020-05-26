const routes = [
  {
    path: 'order-management',
    component: () => import(/* webpackChunkName: "order-management" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'orderManagement',
        component: () => import(/* webpackChunkName: "order-management" */ './views/OrderManagement.vue'),
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
