const routes = [
  {
    path: '/customer-add-new/:id?',
    name: 'customerAddNew',
    component: () => import(/* webpackChunkName: "customer-add-new" */ './views/CustomerAddNew.vue'),
  },
];

export default routes;
