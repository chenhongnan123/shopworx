const routes = [
  {
    path: 'solution',
    name: 'solution',
    component: () => import(/* webpackChunkName: "solution" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
  {
    path: 'solution/:id',
    name: 'solutiondetail',
    component: () => import(/* webpackChunkName: "solution" */ './views/SolutionDetail.vue'),
    props: true,
  },
];

export default routes;
