const routes = [
  {
    path: 'recipe-management',
    component: () => import(/* webpackChunkName: "recipe-management" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'recipeManagement',
        component: () => import(/* webpackChunkName: "recipe-management" */ './views/RecipeManagement.vue'),
      },
      {
        path: ':id',
        name: 'recipe-details',
        component: () => import(/* webpackChunkName: "recipe-management" */ './views/RecipeDetails.vue'),
        props: true,
      },
    ],
  },
];

export default routes;
