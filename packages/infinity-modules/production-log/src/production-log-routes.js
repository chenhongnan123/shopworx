const routes = [
  {
    path: 'production-log',
    component: () => import(/* webpackChunkName: "production-log" */ './views/ProductionLog.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'productionLog',
        component: () => import(/* webpackChunkName: "production-log" */ './views/ProductionMachineView.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
