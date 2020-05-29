const routes = [
  {
    path: 'parameter-configuration',
    name: 'parameterConfiguration',
    component: () => import(/* webpackChunkName: "parameter-configuration" */ './views/ParameterConfiguration.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
