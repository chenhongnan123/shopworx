const routes = [
  {
    path: 'admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [{
      path: ':id',
      name: 'adminWindow',
      component: () => import(/* webpackChunkName: "admin" */ './views/AdminWindow.vue'),
    }],
  },
];

export default routes;
