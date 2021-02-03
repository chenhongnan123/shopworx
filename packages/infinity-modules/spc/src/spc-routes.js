const routes = [
  {
    path: 'spc',
    name: 'spc',
    component: () => import(/* webpackChunkName: "spc-app" */ './views/Main.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
