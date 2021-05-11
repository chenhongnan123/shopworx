const routes = [
  {
    path: 'operator',
    component: () => import(/* webpackChunkName: "operator" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'operator',
        component: () => import(/* webpackChunkName: "operator" */ './views/Operator.vue'),
      },
      {
        path: 'settings/:id?',
        name: 'operatorSettings',
        component: () => import(/* webpackChunkName: "operator" */ './views/OperatorSettings.vue'),
      },
    ],
  },
];

export default routes;
