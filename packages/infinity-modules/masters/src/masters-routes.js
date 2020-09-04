const routes = [
  {
    path: 'masters/:id?',
    name: 'masters',
    component: () => import(/* webpackChunkName: "masters" */ './views/Masters.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
