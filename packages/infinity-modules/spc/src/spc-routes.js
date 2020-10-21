const routes = [
  {
    path: 'spc-app',
    name: 'spcApp',
    component: () => import(/* webpackChunkName: "spc-app" */ './views/Main.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
