const routes = [
  {
    path: 'admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
