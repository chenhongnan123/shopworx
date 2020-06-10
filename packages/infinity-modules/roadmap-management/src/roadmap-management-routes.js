const routes = [
  {
    path: 'roadmap-management',
    component: () => import(/* webpackChunkName: "roadmap-management" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'roadmapManagement',
        component: () => import(/* webpackChunkName: "roadmap-management" */ './views/RoadmapManagement.vue'),
      },
      {
        path: ':id',
        name: 'roadmap-details',
        component: () => import(/* webpackChunkName: "roadmap-management" */ './views/RoadmapDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
