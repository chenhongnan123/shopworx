import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    loading: false,
    showSaveBtn: false,
    meters: [],
  },
  mutations: {
    setLoading: set('loading'),
    setShowSaveBtn: set('showSaveBtn'),
    setMeters: set('meters'),
  },
  actions: {
    fetchMeters: async ({ commit, dispatch }) => {
      commit('setMeters', []);
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'meters',
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setMeters', records);
        return true;
      }
      return false;
    },
  },
});
