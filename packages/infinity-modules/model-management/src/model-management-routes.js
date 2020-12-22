const routes = [
  {
    path: 'model-management',
    component: () => import(/* webpackChunkName: "model-management" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'modelManagement',
        component: () => import(/* webpackChunkName: "model-management" */ './views/ModelManagement.vue'),
      },
      {
        path: ':id',
        name: 'modelDetails',
        component: () => import(/* webpackChunkName: "model-management" */ './views/ModelDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
