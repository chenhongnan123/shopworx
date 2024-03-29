import { set } from '@shopworx/services/util/store.helper';
import FileService from '@shopworx/services/api/file.service';

export default ({
  namespaced: true,
  state: {
    packagerecordlist: [],
  },
  mutations: {
    setPackageRecordlist: set('packagerecordlist'),
  },
  actions: {
    getLabelFile: async () => {
      const { data } = await FileService.getFile(
        // '/lingzhong.prn',
        '/infinity/lingzhong.prn',
      );
      if (data) {
        return data;
      }
      return false;
    },
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
    updatePartStatus: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putPartstatus = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'partstatus',
          id,
          payload,
        },
        { root: true },
      );
      return putPartstatus;
    },
    updatePackageLabelRecord: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const putPackageRecord = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'packagelabel',
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
    getOrderList: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        { elementName: 'order', query },
        { root: true },
      );
      if (list) {
        return list;
      }
      return [];
    },
    addRework: async ({ dispatch }, payload) => {
      const result = await dispatch(
        'element/postRecord',
        {
          elementName: 'rework',
          payload,
        },
        { root: true },
      );
      if (result) {
        return true;
      }
      return false;
    },
  },
});
