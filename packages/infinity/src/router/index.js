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
    await store.dispatch('user/getMe');
    await store.dispatch('user/getMySolutions');
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
  if (!isPublic && !loggedIn) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  } else if (loggedIn && onlyWhenLoggedOut) {
    next({ path: '/' });
  } else if (loggedIn && appPermissionRequired) {
    if (await isAppProvisioned(to.name)) {
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
