const routes = [
  {
    path: '/planning',
    name: 'planning',
    component: () => import(/* webpackChunkName: "planning" */ './views/Planning.vue'),
  },
];

export default routes;
