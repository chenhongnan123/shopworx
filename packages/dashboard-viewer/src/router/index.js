import Vue from 'vue';
import VueRouter from 'vue-router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import routes from './routes';
import store from '../store';

NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 400,
});

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

const isAppProvisioned = async (appLink) => {
  let permit = false;
  const checkAccess = () => store.getters['user/isAppProvisioned'](appLink);
  const { me } = store.state.user;
  if (!me) {
    store.commit('helper/setDashboardLoading', true);
    await store.dispatch('user/getMe');
    await store.dispatch('user/getMySolutions');
    store.commit('helper/setDashboardLoading', false);
  }
  permit = checkAccess();
  return permit;
};

const isTV = store.getters['helper/isTV'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (!store.state.auth.sessionId) {
    store.dispatch('auth/initAuth');
  }
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
  const appPermissionRequired = to.matched.some((record) => record.meta.permissionRequired);
  const loggedIn = store.getters['auth/isLoggedIn'];
  if (!isPublic && !loggedIn) {
    if (!isTV) {
      next({ name: 'login' });
    } else {
      next({ name: 'cast' });
    }
  } else if (loggedIn && onlyWhenLoggedOut) {
    if (!isTV) {
      next({ path: '/' });
    } else {
      next({ name: 'cast' });
    }
  } else if (loggedIn && appPermissionRequired) {
    const appPath = to.fullPath.split('/');
    if (await isAppProvisioned(appPath[1])) {
      next();
    } else {
      next({ path: '/' });
    }
  } else {
    next();
  }
});

router.afterEach(() => NProgress.done());

export default router;
