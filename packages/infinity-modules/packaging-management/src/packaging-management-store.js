import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    packagerecordlist: [],
  },
  mutations: {
    setPackageRecordlist: set('packagerecordlist'),
  },
  actions: {
    getPackageRecord: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'package', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getPackageLabelRecord: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'packagelabel', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    getLabelRule: async ({ dispatch }) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'labelrule' },
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
    updatePackageRecord: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putPackageRecord = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'package',
          id,
          payload,
        },
        { root: true },
      );
      return putPackageRecord;
    },
    updateLabelRule: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putLabelRule = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'labelrule',
          id,
          payload,
        },
        { root: true },
      );
      return putLabelRule;
    },
  },
});