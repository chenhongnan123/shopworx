const routes = [
  {
    path: 'machine',
    name: 'machine',
    component: () => import(/* webpackChunkName: "machine" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
  },
  {
    path: 'machine/:id',
    name: 'machinedetail',
    component: () => import(/* webpackChunkName: "machine" */ './views/MachineDetail.vue'),
    props: true,
  },
];

export default routes;
