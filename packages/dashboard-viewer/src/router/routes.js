const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  },
  {
    path: '/d',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
  },
  {
    path: '/cast',
    name: 'cast',
    component: () => import(/* webpackChunkName: "cast" */ '@/views/Cast.vue'),
  },
  {
    path: '/login-required',
    name: 'login',
    component: () => import(/* webpackChunkName: "login-required" */ '@/views/LoginRequired.vue'),
    meta: {
      public: true,
      onlyWhenLoggedOut: true,
    },
  },
  {
    path: '/onboarding-required',
    name: 'onboarding',
    component: () => import(/* webpackChunkName: "onboarding-required" */ '@/views/OnboardingRequired.vue'),
    meta: {
      public: true,
      onlyWhenLoggedOut: true,
    },
  },
];

export default routes;
