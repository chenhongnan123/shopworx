const routes = [
  {
    path: 'traceability-app',
    name: 'traceabilityApp',
    component: () => import(/* webpackChunkName: "planning" */ './views/TraceabilityMain.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
