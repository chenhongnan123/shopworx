const routes = [
  {
    path: 'sms',
    name: 'customerSms',
    component: () => import(/* webpackChunkName: "customer-sms" */ './views/CustomerSms.vue'),
  },
];

export default routes;
