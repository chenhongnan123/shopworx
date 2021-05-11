const routes = [
  {
    path: 'manual-inbound',
    name: 'manualInbound',
    component: () => import(/* webpackChunkName: "manual-inbound" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
