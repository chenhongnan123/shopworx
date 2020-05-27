const routes = [
  {
    path: 'product-management',
    name: 'productManagement',
    component: () => import(/* webpackChunkName: "product-management" */ './views/ProductManagement.vue'),
    meta: {
      permissionRequired: true,
    },
  },
  {
    path: 'product/:id',
    name: 'productDetails',
    component: () => import(/* webpackChunkName: "product-management" */ './views/ProductDetails.vue'),
    props: true,
  },
];

export default routes;
