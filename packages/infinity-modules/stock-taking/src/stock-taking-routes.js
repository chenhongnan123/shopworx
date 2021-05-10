const routes = [
  {
    path: 'stock-taking',
    name: 'stockTaking',
    component: () => import(/* webpackChunkName: "stock-taking" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
