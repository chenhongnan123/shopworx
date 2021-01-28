const routes = [
  {
    path: 'parameter-configuration-mes',
    name: 'parameterConfigurationMes',
    component: () => import(/* webpackChunkName: "parameter-configuration" */ './views/ParameterConfiguration.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
