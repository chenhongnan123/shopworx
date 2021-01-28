const routes = [
  {
    path: 'parameter-configuration-mes',
    name: 'parameterConfigurationMes',
    component: () => import(/* webpackChunkName: "parameter-configuration-mes" */ './views/ParameterConfiguration.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
