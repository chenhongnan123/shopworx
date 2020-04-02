const routes = [
  {
    path: 'report-viewer',
    name: 'reportViewer',
    component: () => import(/* webpackChunkName: "report-viewer" */ './views/ReportViewer.vue'),
  },
];

export default routes;
