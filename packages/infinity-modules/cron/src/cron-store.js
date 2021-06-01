import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    addCronDialog: false,
    cronList: [],
  },
  mutations: {
    setCronList: set('cronList'),
    setAddCronDialog: set('addCronDialog'),
  },
  actions: {
    updateCron: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putParameter = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'cron',
          id,
          payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteCron: async ({ dispatch }, _id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'cron',
          id: _id,
        },
        { root: true },
      );
      return deleteParameter;
    },
    createCron: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'cron',
          payload,
        },
        { root: true },
      );
      return created;
    },
    getRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'cron',
          query,
        },
        { root: true },
      );
      let cron = [];
      if (list && list.length) {
        cron = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setCronList', cron);
      return cron;
    },
  },
});
