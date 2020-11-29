const routes = [
  {
    path: 'production-planning',
    component: () => import(/* webpackChunkName: "production-planning" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'productionPlanning',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/ProductionPlanning.vue'),
      },
      {
        path: 'add',
        name: 'addProductionPlan',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/AddProductionPlan.vue'),
        props: true,
      },
      {
        path: 'reorder',
        name: 'reorderPlans',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/ReorderProductionPlans.vue'),
        props: true,
      },
      {
        path: 'p/:id',
        name: 'productionPlanDetails',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/ProductionPlanDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
