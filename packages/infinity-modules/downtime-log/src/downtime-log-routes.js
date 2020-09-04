const routes = [
  {
    path: 'downtime-log',
    name: 'downtimeLog',
    component: () => import(/* webpackChunkName: "downtime-log" */ './views/DowntimeLog.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];

export default routes;
