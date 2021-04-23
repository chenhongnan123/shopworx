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

const isAppProvisioned = async (appName) => {
  let permit = false;
  const checkAccess = () => store.getters['user/isAppProvisioned'](appName);
  const { me } = store.state.user;
  if (!me) {
    store.commit('helper/setInfinityLoading', true);
    await store.dispatch('user/getMe');
    await store.dispatch('user/getMySolutions');
    store.commit('helper/setInfinityLoading', false);
  }
  permit = checkAccess();
  return permit;
};

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (!store.state.auth.sessionId) {
    store.dispatch('auth/initAuth');
  }
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
  const appPermissionRequired = to.matched.some((record) => record.meta.permissionRequired);
  const loggedIn = store.getters['auth/isLoggedIn'];
  const operatorConfirmed = store.getters['auth/isOperatorConfirmed'];
  if (!isPublic && (!loggedIn || !operatorConfirmed)) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  } else if (loggedIn && operatorConfirmed && onlyWhenLoggedOut) {
    next({ path: '/' });
  } else if (loggedIn && operatorConfirmed && appPermissionRequired) {
    const appPath = to.fullPath.split('/');
    if (await isAppProvisioned(appPath[1])) {
      next();
    } else {
      next({ name: '401' });
    }
  } else {
    next();
  }
});

router.afterEach(() => NProgress.done());

export default router;
