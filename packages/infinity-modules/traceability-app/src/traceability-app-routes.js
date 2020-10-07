const routes = [
  {
    path: 'traceability-app',
    name: 'traceabilityApp',
    component: () => import(/* webpackChunkName: "planning" */ './views/TraceabilityUI.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
