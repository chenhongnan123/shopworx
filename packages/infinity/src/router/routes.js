const routes = [
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue'),
  },
  {
    path: '/401',
    name: '401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/401.vue'),
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/InfinityHome.vue'),
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/Account.vue'),
      },
    ],
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
];

export default routes;
