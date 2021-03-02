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
    getAppSchema: async ({ commit, state, dispatch }) => {
      const { activeAppId } = state;
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'appschema',
          query: `?query=appid=="${activeAppId}"`,
        },
        { root: true },
      );
      if (records && records.length === 1) {
        commit('setAppSchema', records[0]);
      }
    },
    updateAppSchema: async ({ commit, state, dispatch }, appSchema) => {
      const { activeAppId } = state;
      const payload = {
        appid: activeAppId,
        appschema: appSchema,
      };
      const upsert = await dispatch(
        'element/upsertRecordByQuery',
        {
          elementName: 'appschema',
          record: payload,
          query: `?query=appid=="${activeAppId}"`,
        },
        { root: true },
      );
      if (upsert) {
        commit('setAppSchema', appSchema);
      }
    },
  },
});
