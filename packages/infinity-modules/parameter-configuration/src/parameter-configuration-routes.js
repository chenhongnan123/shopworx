const routes = [
  {
    path: 'parameter-configuration',
    name: 'parameterConfiguration',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ParameterConfiguration.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
