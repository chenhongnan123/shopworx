const routes = [
  {
    path: 'cron',
    name: 'cron',
    component: () => import(/* webpackChunkName: "cron" */ './views/Cron.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
