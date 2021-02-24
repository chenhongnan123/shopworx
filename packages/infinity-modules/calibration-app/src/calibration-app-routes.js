const routes = [
  {
    path: 'calibration-app',
    name: 'calibrationApp',
    component: () => import(/* webpackChunkName: "parameter-configuration" */ './views/CalibrationUI.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
