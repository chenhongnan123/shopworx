const routes = [
  {
    path: 'roadmap-management',
    component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'roadmapManagement',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/RoadmapManagement.vue'),
      },
      {
        path: ':id',
        name: 'roadmap-details',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/RoadmapDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
