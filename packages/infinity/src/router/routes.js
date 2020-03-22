const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    meta: {
      public: true,
      onlyWhenLoggedOut: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import(/* webpackChunkName: "forgot-password" */ '@/views/ForgotPassword.vue'),
    meta: {
      public: true,
      onlyWhenLoggedOut: true,
    },
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import(/* webpackChunkName: "welcome" */ '@/views/Welcome.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import(/* webpackChunkName: "setup" */ '@/views/Setup.vue'),
  },
];

export default routes;
