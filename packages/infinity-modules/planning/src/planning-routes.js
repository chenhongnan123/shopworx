const routes = [
  {
    path: 'planning',
    name: 'planning',
    component: () => import(/* webpackChunkName: "planning" */ './views/Planning.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
