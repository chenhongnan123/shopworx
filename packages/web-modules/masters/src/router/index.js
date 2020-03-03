const routes = [
  {
    path: 'masters',
    name: 'masters',
    component: () => import(/* webpackChunkName: "masters" */ '../views/Masters.vue'),
    children: [
      {
        path: ':id',
        name: 'master-details',
        component: () => import(/* webpackChunkName: "masters" */ '../views/MasterDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
