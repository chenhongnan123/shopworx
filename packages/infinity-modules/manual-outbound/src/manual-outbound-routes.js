const routes = [
  {
    path: 'manual-outbound',
    name: 'manualOutbound',
    component: () => import(/* webpackChunkName: "manual-outbound" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
