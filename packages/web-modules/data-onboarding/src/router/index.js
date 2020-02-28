const routes = [
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import(/* webpackChunkName: "onboarding" */ '../views/OnboardingWelcome.vue'),
  },
  {
    path: '/data-onboarding',
    name: 'data-onboarding',
    component: () => import(/* webpackChunkName: "onboarding" */ '../views/DataOnboarding.vue'),
  },
];

export default routes;
