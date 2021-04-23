// import { set } from '@shopworx/services/util/store.helper';
export default ({
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    getPartStatus: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'partstatus', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getSubstationList: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'substation', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getCheckin: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'checkin', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getCheckout: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'checkout', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getNgConfig: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'ngcodeconfig', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
  },
});
