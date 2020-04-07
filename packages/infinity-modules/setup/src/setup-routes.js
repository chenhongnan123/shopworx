const routes = [
  {
    path: '/setup',
    name: 'setup',
    component: () => import(/* webpackChunkName: "setup" */ './views/Setup.vue'),
  },
];

export default routes;
