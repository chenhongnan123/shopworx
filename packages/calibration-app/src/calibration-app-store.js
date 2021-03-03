export default ({
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
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
    getModeList: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'calibrationmode', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getCalibrationDetail: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'calibrationdetail', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getCalibrationParameter: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'calibrationparameter', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
  },
});
