const routes = [
  {
    path: 'rework-operation',
    name: 'reworkOperation',
    component: () => import(/* webpackChunkName: "rework-operation" */ './views/ReworkOperation.vue'),
    meta: {
      permissionRequired: true,
    },
  },
  {
    path: 'rework/:id',
    name: 'reworkDetails',
    component: () => import(/* webpackChunkName: "rework-operation" */ './views/ReworkDetails.vue'),
    props: true,
  },
];

export default routes;
