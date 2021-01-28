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
        path: 'settings/:id?',
        name: 'productionPlanSettings',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/ProductionPlanSettings.vue'),
      },
      {
        path: 'plan',
        name: 'addProductionPlan',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/AddProductionPlan.vue'),
      },
      {
        path: 'reorder',
        name: 'reorderPlans',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/ReorderProductionPlans.vue'),
      },
      {
        path: 'plan/:id',
        name: 'productionPlanDetails',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/ProductionPlanDetails.vue'),
        props: true,
      },
      {
        path: 'plan/:id/edit',
        name: 'editProductionPlan',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/EditProductionPlan.vue'),
        props: true,
      },
      {
        path: 'plan/:id/duplicate',
        name: 'duplicateProductionPlan',
        component: () => import(/* webpackChunkName: "production-planning" */ './views/DuplicateProductionPlan.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
