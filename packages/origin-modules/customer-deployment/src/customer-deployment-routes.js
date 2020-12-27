const routes = [
  {
    path: 'deployment',
    component: () => import(/* webpackChunkName: "customer-deployment" */ './views/Index.vue'),
    meta: {
      permissionRequired: true,
    },
    children: [
      {
        path: '',
        name: 'customerDeployment',
        component: () => import(/* webpackChunkName: "customer-deployment" */ './views/CustomerDeployment.vue'),
      },
      {
        path: 'settings/:id?',
        name: 'deploymentSettings',
        component: () => import(/* webpackChunkName: "customer-deployment" */ './views/DeploymentSettings.vue'),
      },
      {
        path: 'updates',
        name: 'deploymentUpdates',
        component: () => import(/* webpackChunkName: "customer-deployment" */ './views/DeploymentUpdates.vue'),
      },
    ],
  },
];

export default routes;
