const routes = [
  {
    path: 'ng-code-configuration',
    name: 'ngCodeConfiguration',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ReworkOperation.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
