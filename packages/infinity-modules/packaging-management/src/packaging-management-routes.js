const routes = [
  {
    path: 'packaging-management',
    name: 'packaging-management',
    component: () => import(/* webpackChunkName: "parameter-configuration" */ './views/PackagingManagement.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
