const routes = [
  {
    path: 'admin/:id?',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    props: true,
  },
];

export default routes;
