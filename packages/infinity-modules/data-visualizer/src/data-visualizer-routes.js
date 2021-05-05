const routes = [
  {
    path: 'rawdata',
    name: 'rawdata',
    component: () => import(/* webpackChunkName: "data-visualizer" */ './views/DataVisualizer.vue'),
    meta: {
      permissionRequired: true,
    },
  },
];
export default routes;
