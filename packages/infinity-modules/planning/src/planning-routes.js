const routes = [
  {
    path: 'production-planning',
    component: () => import(/* webpackChunkName: "planning" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'productionPlanning',
        component: () => import(/* webpackChunkName: "planning" */ './views/Planning.vue'),
      },
      {
        path: ':id',
        name: 'plan-detail',
        component: () => import(/* webpackChunkName: "planning" */ './views/PlanDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
