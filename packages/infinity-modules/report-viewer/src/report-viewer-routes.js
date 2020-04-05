const routes = [
  {
    path: 'reports',
    name: 'reports',
    component: () => import(/* webpackChunkName: "reports" */ './views/ReportViewer.vue'),
  },
];

export default routes;
