const routes = [
  {
    path: 'packaging-management',
    name: 'packagingManagement',
    component: () => import(/* webpackChunkName: "parameter-configuration" */ './views/PackagingManagement.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
