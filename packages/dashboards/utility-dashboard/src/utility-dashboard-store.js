import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    loading: false,
    showSaveBtn: false,
  },
  mutations: {
    setLoading: set('loading'),
    setShowSaveBtn: set('showSaveBtn'),
  },
  actions: {},
});
