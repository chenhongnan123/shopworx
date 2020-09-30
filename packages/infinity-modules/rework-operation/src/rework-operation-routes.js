const routes = [
  {
    path: 'rework-operation',
    name: 'reworkOperation',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ReworkOperation.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
