// import HourService from '@shopworx/services/api/hour.service';
import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    parts: [],
    orderList: [],
    orderTypeList: [],
    assets: [],
    filter: false,
    onboarded: false,
    addPlanDialog: false,
    planningMaster: null,
    partMatrixMaster: [],
    partMatrixRecords: [],
    planningElement: null,
    primaryMatrixTags: [],
    partMatrixElement: null,
    notStartedPlanCount: 0,
    interruptedOrderCount: 0,
    completedOrdersCount: 0,
    onTimePlanCount: 0,
    pausedPlanCount: 0,
    roadmapList: [],
    roadmapDetails: [],
    productList: [],
    productDetails: [],
  },
  mutations: {
    toggleFilter: toggle('filter'),
    setFilter: set('filter'),
    setParts: set('parts'),
    setOrderTypes: set('orderTypeList'),
    setAssets: set('assets'),
    setOnboarded: set('onboarded'),
    setAddPlanDialog: set('addPlanDialog'),
    setPlanningMaster: set('planningMaster'),
    setPartMatrixMaster: set('partMatrixMaster'),
    setPartMatrixRecords: set('partMatrixRecords'),
    setPlanningElement: set('planningElement'),
    setPrimaryMatrixTags: set('primaryMatrixTags'),
    setPartMatrixElement: set('partMatrixElement'),
    setNotStartedPlanCount: set('notStartedPlanCount'),
    setInterruptedOrderCount: set('interruptedOrderCount'),
    setCompletedOrdersCount: set('completedOrdersCount'),
    setOnTimePlanCount: set('onTimePlanCount'),
    setPausedPlanCount: set('pausedPlanCount'),
    setOrderList: set('orderList'),
    setRoadmapList: set('roadmapList'),
    setRoadmapDetails: set('roadmapDetails'),
    setProductList: set('productList'),
    setProductDetails: set('productDetails'),
  },
  actions: {
    getAssets: async ({ commit, dispatch }) => {
      const assets = await dispatch(
        'industry/getAssets',
        null,
        { root: true },
      );
      if (assets && assets.length) {
        commit('setAssets', assets);
        return true;
      }
      return false;
    },

    getPorducts: async ({ commit, dispatch }) => {
      const parts = await dispatch(
        'element/getRecords',
        { elementName: 'part' },
        { root: true },
      );
      if (parts && parts.length) {
        commit('setParts', parts);
      }
    },

    getOrderTypeList: async ({ commit, dispatch }) => {
      const ordertypes = await dispatch(
        'element/getRecords',
        { elementName: 'ordertype' },
        { root: true },
      );
      if (ordertypes && ordertypes.length) {
        commit('setOrderTypes', ordertypes);
      }
    },

    getPorductRecords: async ({ commit, dispatch }, { productname }) => {
      const payload = {
        elementName: 'part',
        query: `?query=productname=="${productname}"`,
      };
      const partMatrixRecords = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (partMatrixRecords && partMatrixRecords.length) {
        commit('setPartMatrixRecords', partMatrixRecords);
      }
    },

    isFamilyMold: async ({ dispatch }, query) => {
      const payload = {
        elementName: 'mold',
        query,
      };
      const molds = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (molds && molds.length === 1) {
        return molds[0].isfamilymold;
      }
      return false;
    },

    getFamilyParts: async ({ dispatch }, query) => {
      const payload = {
        elementName: 'partmatrix',
        query,
      };
      const partMatrixRecords = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (partMatrixRecords && partMatrixRecords.length) {
        return partMatrixRecords;
      }
      return [];
    },

    getPrimaryMatrixTags: async ({ commit, getters, dispatch }, assetId) => {
      const partMatrixElements = getters.partMatrixComposition(assetId);
      const partMatrixTags = await Promise.all(
        partMatrixElements.map(async (element) => {
          const elem = await dispatch(
            'element/getElement',
            element,
            { root: true },
          );
          const tag = elem.tags
            .filter((t) => t.assetId === assetId)
            .find((t) => t.tagName === elem.element.uniqueTagName);
          return {
            tag,
            element: elem.element.elementName,
          };
        }),
      );
      commit('setPrimaryMatrixTags', partMatrixTags);
    },

    createOrder: async ({ dispatch, commit }, payload) => {
      let list = [];
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'order',
          payload,
        },
        { root: true },
      );
      if (created) {
        const query = '';
        const orders = await dispatch(
          'element/getRecords',
          {
            elementName: 'order',
            query,
          },
          { root: true },
        );
        if (orders) {
          debugger;
          list = orders;
          list = list.sort((a, b) => b.indexno - a.indexno);
          commit('setOrderList', list);
          return orders;
        }
      }
      return created;
    },

    updateOrder: async ({ dispatch }, payload) => {
      debugger;
      const created = await dispatch(
        'element/putRecord',
        {
          elementName: 'order',
          payload,
        },
        { root: true },
      );
      return created;
    },

    createFamilyPlan: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'planning',
          payload,
        },
        { root: true },
      );
      return created;
    },

    getOrderRecords: async ({ dispatch }, query) => {
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query,
        },
        { root: true },
      );
      return orders;
    },

    getRoadMap: async ({ dispatch, commit }, query) => {
      let list = [];
      const roadmap = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmaplist',
          query,
        },
        { root: true },
      );
      if (roadmap) {
        list = roadmap;
        commit('setRoadmapList', list);
        const details = await dispatch(
          'element/getRecords',
          {
            elementName: 'roadmapdetails',
            query: `?query=roadmapid=="${list[0].id}"`,
          },
          { root: true },
        );
        if (details) {
          commit('setRoadmapDetails', details);
        }
      }
    },

    getProductDetails: async ({ dispatch, commit }, query) => {
      let list = [];
      const product = await dispatch(
        'element/getRecords',
        {
          elementName: 'part',
          query,
        },
        { root: true },
      );
      if (product) {
        list = product;
        commit('setProductList', list);
        const details = await dispatch(
          'element/getRecords',
          {
            elementName: 'productdetails',
            query: `?query=productnumber=="${list[0].productnumber}"`,
          },
          { root: true },
        );
        if (details) {
          commit('setProductDetails', details);
        }
      }
    },

    getOrderListRecords: async ({ dispatch, commit }, query) => {
      let list = [];
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query,
        },
        { root: true },
      );
      list = orders;
      list = list.sort((a, b) => b.indexno - a.indexno);
      commit('setOrderList', list);
      return orders;
    },

    /* getScheduledEnd: async (_, { start, end }) => {
      let scheduledEnd = 0;
      console.log({ start, end });
      const { data } = await HourService.getNonWorkingTime(start, end);
      if (data && data.results) {
        scheduledEnd = end + data.results.nonWorkingTime;
      }
      return scheduledEnd;
    }, */
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
