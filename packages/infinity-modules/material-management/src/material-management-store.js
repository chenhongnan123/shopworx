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
    materialListChoice: [],
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
    setMaterialListChoice: set('materialListChoice'),
  },
  actions: {
    getMaterialListChoice: async ({ dispatch, commit }, query) => {
      const list = [];
      const obj = {
        name: '-',
      };
      list.push(obj);
      const materialListChoice = await dispatch(
        'element/getRecords',
        {
          elementName: 'materiallist',
          query,
        },
        { root: true },
      );
      materialListChoice.forEach((f) => {
        list.push(f);
      });
      commit('setMaterialListChoice', list);
    },
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
      const categoryListFilter = categoryList.filter((category) => category.name === 'BatchID' || category.name === 'ComponentID');
      commit('setLineList', lineList);
      commit('setCategoryList', categoryListFilter);
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
  },
});
