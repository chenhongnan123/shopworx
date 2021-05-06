const routes = [
  {
    path: 'spc',
    name: 'spc',
    component: () => import(/* webpackChunkName: "spc-app" */ './views/Main.vue'),
    meta: {
      permissionRequired: false,
    },
  },
];

export default routes;
