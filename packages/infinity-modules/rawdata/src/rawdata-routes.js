const routes = [
  {
    path: 'rawdata',
    name: 'rawdata',
    component: () => import(/* webpackChunkName: "rawdata" */ './views/RawData.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];
export default routes;
