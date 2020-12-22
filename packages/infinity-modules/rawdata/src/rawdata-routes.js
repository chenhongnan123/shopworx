const routes = [
  {
    path: 'rawdata',
    name: 'rawdata',
    component: () => import(/* webpackChunkName: "rawdata" */ './views/DataVisualizer.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];
export default routes;
