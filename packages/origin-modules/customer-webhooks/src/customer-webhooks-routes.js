const routes = [
  {
    path: 'webhooks',
    name: 'customerWebhooks',
    component: () => import(/* webpackChunkName: "customer-webhooks" */ './views/CustomerWebhooks.vue'),
  },
];

export default routes;
