// import HourService from '@shopworx/services/api/hour.service';
import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    materialList: [],
    onboarded: false,
    addMaterialDialog: false,
    lineList: [],
    sublineList: [],
    categoryList: [],
    filter: false,
    lineValue: '',
    sublineValue: '',
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setMaterialList: set('materialList'),
    setaddMaterialDialog: set('addMaterialDialog'),
    setLineList: set('lineList'),
    setSublineList: set('sublineList'),
    setCategoryList: set('categoryList'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setLineValue: set('lineValue'),
    setSublineValue: set('sublineValue'),
  },
  actions: {
    getMaterialListRecords: async ({ dispatch, commit }, query) => {
      const materiallist = await dispatch(
        'element/getRecords',
        {
          elementName: 'materiallist',
          query,
        },
        { root: true },
      );
      commit('setMaterialList', materiallist);
    },
    getDefaultList: async ({ dispatch, commit }) => {
      const lineList = await dispatch(
        'element/getRecords',
        { elementName: 'line' },
        { root: true },
      );
      const categoryList = await dispatch(
        'element/getRecords',
        { elementName: 'category' },
        { root: true },
      );
      commit('setLineList', lineList);
      commit('setCategoryList', categoryList);
    },
    getSublineList: async ({ commit, dispatch }, query) => {
      const sublineList = await dispatch(
        'element/getRecords',
        { elementName: 'subline', query },
        { root: true },
      );
      if (sublineList) {
        commit('setSublineList', sublineList);
      }
    },
    createMaterial: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'materiallist',
          payload,
        },
        { root: true },
      );
      return created;
    },
    updateMaterial: async ({ dispatch }, payload) => {
      const putParameter = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'materiallist',
          queryParam: payload.query,
          payload: payload.payload,
        },
        { root: true },
      );
      return putParameter;
    },
    deleteMaterial: async ({ dispatch }, id) => {
      const deleteParameter = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'materiallist',
          queryParam: `?query=id==${id}`,
        },
        { root: true },
      );
      return deleteParameter;
    },
  },
  getters: {
    planningSchema: (_, __, rootState, rootGetters) => {
      const { appSchema } = rootState.webApp;
      const licensedAssets = rootGetters['user/licensedAssets'];
      if (appSchema) {
        return appSchema.filter((schema) => licensedAssets.includes(schema.assetId));
      }
      return [];
    },

    partMatrixComposition: (_, { planningSchema }) => (assetId) => {
      if (planningSchema && planningSchema.length) {
        return planningSchema
          .find((schema) => schema.assetId === assetId)
          .partMatrixComposition;
      }
      return [];
    },

    primaryDisplayTag: (_, { planningSchema }) => (assetId) => {
      if (planningSchema && planningSchema.length) {
        return planningSchema
          .find((schema) => schema.assetId === assetId)
          .primaryDisplayTag;
      }
      return 'planid';
    },

    optionalPlanMasterFields: ({ planningMaster }) => (assetId) => {
      if (planningMaster) {
        return planningMaster.masterTags
          .filter((tag) => (
            tag.assetId === assetId
            && !tag.hide
            && !tag.required
          ));
      }
      return [];
    },

    requiredPlanMasterFields: ({ planningMaster }) => (assetId) => {
      if (planningMaster) {
        return planningMaster.masterTags
          .filter((tag) => (
            tag.assetId === assetId
            && !tag.hide
            && tag.required
          ));
      }
      return [];
    },

    selectedAsset: ({ assets }) => (assetId) => {
      let asset = null;
      if (assets && assets.length && assetId) {
        asset = assets.find((a) => a.id === assetId);
        if (asset) {
          asset = asset.assetName;
        }
      }
      return asset;
    },

    partMatrixTags: ({ partMatrixElement }) => (assetId) => {
      let tags = [];
      if (partMatrixElement && assetId) {
        tags = partMatrixElement.tags.filter((tag) => tag.assetId === assetId && !tag.hide);
      }
      return tags;
    },

    planningTags: ({ planningElement }) => (assetId) => {
      let tags = [];
      if (planningElement && assetId) {
        tags = planningElement.tags.filter((tag) => tag.assetId === assetId && !tag.hide);
      }
      return tags;
    },

    filteredPartMatrixRecords: ({ partMatrixRecords }) => (filters = null) => {
      let records = partMatrixRecords;
      if (filters) {
        const filterKeys = Object.keys(filters);
        records = partMatrixRecords.filter((record) => filterKeys
          .every((key) => record[key] === filters[key]));
      }
      return records;
    },
  },
});
