const routes = [
  {
    path: 'material-management',
    component: () => import(/* webpackChunkName: "material-management" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'materialManagement',
        component: () => import(/* webpackChunkName: "material-management" */ './views/Main.vue'),
      },
      {
        path: ':id/:name/:lineid',
        name: 'bom-details',
        component: () => import(/* webpackChunkName: "material-management" */ './views/NewBomDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
