const routes = [
  {
    path: 'maintenance-plan',
    name: 'maintenancePlan',
    component: () => import(/* webpackChunkName: "maintenance-plan" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
  {
    path: 'maintenance-plan/:id',
    name: 'maintenance-plandetail',
    // prettier-ignore
    component: () => import(/* webpackChunkName: "maintenance-plan" */ './views/PlanDetail.vue'),
    props: true,
  },
];

export default routes;
