const routes = [
  {
    path: 'model-management',
    name: 'modelManagement',
    component: () => import(/* webpackChunkName: "model-management" */ './views/ModelManagement.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
