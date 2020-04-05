const routes = [
  {
    path: 'masters',
    name: 'masters',
    component: () => import(/* webpackChunkName: "masters" */ './views/Masters.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
