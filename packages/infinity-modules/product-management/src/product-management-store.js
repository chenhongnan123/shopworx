import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    filter: false,
    lineList: [],
    productList: [],
    roadmapsDetails: [],
    addProductDialog: false,
    productDetails: [],
    roadmapForProduct: [],
    recipeList: [],
    bom: [],
    productTypeCategory: [],
    duplicateProductDialog: false,
    editProductDialog: false,
    deleteDialog: false,
    selectedProduct: null,
    selectedBOM: null,
    selectedRoadmap: null,
  },
  mutations: {
    setLineList: set('lineList'),
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setProductList: set('productList'),
    setRoadmapdetails: set('roadmapsDetails'),
    setAddProductDialog: set('addProductDialog'),
    setDuplicateDialog: set('duplicateProductDialog'),
    setEditDialog: set('editProductDialog'),
    setProductDetails: set('productDetails'),
    setRoadmapForProduct: set('roadmapForProduct'),
    setRecipeList: set('recipeList'),
    setBom: set('bom'),
    setProductTypeCategory: set('productTypeCategory'),
    setDeleteDialog: set('deleteDialog'),
    setSelectedProduct: set('selectedProduct'),
    setSelectedBOM: set('selectedBOM'),
    setSelectedRoadmap: set('selectedRoadmap'),
  },
  actions: {
    getLines: async ({ dispatch, commit }, query) => {
      const line = await dispatch(
        'element/getRecords',
        {
          elementName: 'line',
          query,
        },
        { root: true },
      );
      commit('setLineList', line);
    },
    getRoadmaps: async ({ dispatch, commit }, query) => {
      const roadmaps = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaplist',
          query,
        },
        { root: true },
      );
      commit('setRoadmapdetails', roadmaps);
    },
    getBOM: async ({ dispatch, commit }, query) => {
      const bom = await dispatch(
        'element/getRecords',
        {
          elementName: 'bomlist',
          query,
        },
        { root: true },
      );
      commit('setBom', bom);
    },
    getProductTypeCategory: async ({ dispatch, commit }, query) => {
      const productTypeCategory = await dispatch(
        'element/getRecords',
        {
          elementName: 'producttype',
          query,
        },
        { root: true },
      );
      commit('setProductTypeCategory', productTypeCategory);
    },
    getProductListRecords: async ({ dispatch, commit }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'part',
          query,
        },
        { root: true },
      );
      let product = [];
      if (list && list.length) {
        product = list.map((l, index) => ({
          ...l,
          selected: false,
          actions: '',
          numberIndex: index + 1,
        }));
      }
      commit('setProductList', product);
    },
    checkDuplicateProduct: async ({ dispatch }, query) => {
      const list = await dispatch(
        'element/getRecords',
        {
          elementName: 'part',
          query,
        },
        { root: true },
      );
      let duplicateFound = false;
      if (list && list.length) {
        duplicateFound = true;
      }
      return duplicateFound;
    },
    createProduct: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'part',
          payload,
        },
        { root: true },
      );
      if (created) {
        dispatch('getProductListRecords');
        return true;
      }
      return false;
    },
    getProductDetails: async ({ dispatch, commit }, productNumber) => {
      const query = `?query=productnumber=="${productNumber}"`;
      const productDetails = await dispatch(
        'element/getRecords',
        {
          elementName: 'productdetails',
          query,
        },
        { root: true },
      );
      commit('setProductDetails', productDetails);
    },
    getRoadmapForProduct: async ({ dispatch, commit }, roadmapid) => {
      const query = `?query=roadmapid=="${roadmapid}"`;
      const roadmapForProduct = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
          query,
        },
        { root: true },
      );
      commit('setRoadmapForProduct', roadmapForProduct);
    },
    getRecipies: async ({ dispatch, commit }, query) => {
      const recipeList = await dispatch(
        'element/getRecords',
        {
          elementName: 'recipelist',
          query,
        },
        { root: true },
      );
      commit('setRecipeList', recipeList);
    },
    createProductDetails: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'productdetails',
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    updateProductDetails: async ({ dispatch }, postData) => {
      const {
        id,
        payload,
        productid,
        productVersion,
      } = postData;
      const productPayload = {
        editedby: payload.editedby,
        editedtime: payload.editedtime,
        productversionnumber: (productVersion + 1),
      };
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'productdetails',
          id,
          payload,
        },
        { root: true },
      );
      if (updated) {
        dispatch('updateProductType', { id: productid, payload: productPayload });
        return true;
      }
      return false;
    },
    updateProductType: async ({ dispatch }, postData) => {
      const { id, payload } = postData;
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'part',
          id,
          payload,
        },
        { root: true },
      );
      if (updated) {
        dispatch('getProductListRecords', '');
        return true;
      }
      return false;
    },
    delectByQuery: async ({ dispatch }, payload) => {
      const { elementName, productName } = payload;
      const updated = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName,
          queryParam: `?query=productname=="${productName}"`,
        },
        { root: true },
      );
      if (updated) {
        return true;
      }
      return false;
    },
  },
});
