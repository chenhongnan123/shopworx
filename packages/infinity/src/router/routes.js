const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '@/views/InfinityHome.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: { name: 'user-dashboard' },
      },
      {
        path: 'home',
        name: 'user-dashboard',
        component: () => import(/* webpackChunkName: "user-dashboard" */ '@/views/UserDashboard.vue'),
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import(/* webpackChunkName: "user-dashboard" */ '@/views/UserProfile.vue'),
      },
      {
        path: 'machine-dashboard',
        component: () => import(/* webpackChunkName: "machine-dashboard" */ '@/views/MachineDashboard.vue'),
        children: [
          {
            path: '',
            name: 'machine-dashboard',
            component: () => import(/* webpackChunkName: "machine-dashboard" */ '@/components/machine-dashboard/MachineDashboard.vue'),
          },
          {
            path: ':id',
            name: 'machine-details',
            component: () => import(/* webpackChunkName: "machine-details" */ '@/components/machine-dashboard/MachineDetails.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'planning',
        component: () => import(/* webpackChunkName: "planning" */ '@/views/Planning.vue'),
        children: [
          {
            path: '',
            name: 'planning',
            component: () => import(/* webpackChunkName: "planning" */ '@/components/planning/Planning.vue'),
          },
          {
            path: ':id',
            name: 'plan-details',
            component: () => import(/* webpackChunkName: "plan-details" */ '@/components/planning/PlanDetails.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'report/:id',
        name: 'reports',
        component: () => import(/* webpackChunkName: "reports" */ '@/views/Reports.vue'),
        props: true,
      },
      {
        path: 'masters',
        name: 'masters',
        component: () => import(/* webpackChunkName: "masters" */ '@/views/Masters.vue'),
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
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
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
  },
  {
    path: '/invite',
    name: 'invite',
    component: () => import(/* webpackChunkName: "invite" */ '@/views/Invite.vue'),
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: () => import(/* webpackChunkName: "welcome" */ '@/views/Welcome.vue'),
  },
];

export default routes;
