const routes = [
  {
    path: 'maintenance-task',
    name: 'maintenanceTask',
    component: () => import(/* webpackChunkName: "maintenance-task" */ './views/Index.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
  {
    path: 'maintenance-task/:id',
    name: 'maintenance-taskdetail',
    // prettier-ignore
    component: () => import(/* webpackChunkName: "maintenance-task" */ './views/TaskDetail.vue'),
    props: true,
  },
];

export default routes;
