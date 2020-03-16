const routes = [
  {
    path: 'planning',
    component: () => import(/* webpackChunkName: "planning" */ '../views/PlanningContainer.vue'),
    children: [
      {
        path: '',
        name: 'planning',
        component: () => import(/* webpackChunkName: "planning" */ '../components/PlanningView.vue'),
      },
      {
        path: ':id',
        name: 'plan-details',
        component: () => import(/* webpackChunkName: "plan-details" */ '../components/PlanDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
