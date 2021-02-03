const routes = [
  {
    path: 'packaging-management',
    name: 'packagingManagement',
    component: () => import(/* webpackChunkName: "packaging-management" */ './views/PackagingManagement.vue'),
    meta: {
      // permissionRequired: true,
    },
  },
];

export default routes;
