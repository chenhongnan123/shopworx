import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    appSchema: null,
    activeAppId: null,
  },
  mutations: {
    setAppSchema: set('appSchema'),
    setActiveAppId: set('activeAppId'),
  },
  actions: {
    getAppSchema: async ({ commit, state, rootState }) => {
      try {
        const { me } = rootState.user;
        const roleId = me.role.id;
        const { activeAppId } = state;
        const { data } = await SiteService.getApp(roleId, activeAppId);
        if (data && data.results) {
          try {
            commit('setAppSchema', JSON.parse(data.results.schema));
          } catch (e) {
            commit('helper/setAlert', {
              show: true,
              type: 'error',
              message: 'INVALID_APP_SCHEMA',
            }, {
              root: true,
            });
          }
        }
      } catch (e) {
        return false;
      }
      return true;
    },
  },
});
