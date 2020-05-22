const routes = [
  {
    path: 'recipe-management',
    component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'recipeManagement',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/RecipeManagement.vue'),
      },
      {
        path: ':id',
        name: 'recipe-details',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ './views/RecipeDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
