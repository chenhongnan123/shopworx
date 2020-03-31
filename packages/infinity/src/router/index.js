import Vue from 'vue';
import VueRouter from 'vue-router';
import SessionService from '@shopworx/services/util/session.service';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((record) => record.meta.public);
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut);
  const loggedIn = !!SessionService.getSession();
  if (!isPublic && !loggedIn) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  }
  if (loggedIn && onlyWhenLoggedOut) {
    next({ path: '/' });
  }
  next();
});

export default router;
