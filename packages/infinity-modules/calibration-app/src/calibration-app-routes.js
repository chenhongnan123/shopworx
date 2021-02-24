const routes = [
  {
    path: 'calibration-app',
    name: 'calibrationApp',
    component: () => import(/* webpackChunkName: "calibration-app" */ './views/CalibrationUI.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
