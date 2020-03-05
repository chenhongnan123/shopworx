const routes = [
  {
    path: 'masters/:id?',
    name: 'masters',
    component: () => import(/* webpackChunkName: "masters" */ '../views/Masters.vue'),
    props: true,
  },
];

export default routes;
