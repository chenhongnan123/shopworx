const routes = [
  {
    path: 'model-management',
    name: 'modelManagement',
    component: () => import(/* webpackChunkName: "model-management" */ './views/ModelDetails.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
