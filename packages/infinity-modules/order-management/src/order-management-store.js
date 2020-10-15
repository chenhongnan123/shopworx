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
    productDetailsList: [],
    roadmapDetailsList: [],
    lineList: [],
    productDetailsRecord: [],
    roadMapDetailsRecord: [],
    runningOrderList: [],
    subStationWiseOrderCount: [],
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
    setProductDetailList: set('productDetailsList'),
    setRoadmapDetailList: set('roadmapDetailsList'),
    setLineList: set('lineList'),
    setProductDetailsRecord: set('productDetailsRecord'),
    setRoadMapDetailsRecord: set('roadMapDetailsRecord'),
    setrunningOrderList: set('runningOrderList'),
    setSubStationWiseOrderCounts: set('subStationWiseOrderCount'),
  },
  actions: {
    getSubStationWiseOrderCounts: async ({ dispatch, commit }, payload) => {
      let list = [];
      if (payload.substationlist && payload.substationlist.length) {
        list = payload.substationlist.map((l) => ({
          ...l,
          okcount: 0,
          ngcount: 0,
        }));
      }
      console.log(list);
      let listUpdated = [];
      if (list.length) {
        // OK = checkout which substationid + ordernumber +
        // modestatus == 0 + substationresult==1 or substationresult==7
        // NG = partstatus which substationid + ordernumber +
        // modestatus == 0 + substationresult != 1
        listUpdated = await Promise.all(list.map(async (item) => {
          const checkout = await dispatch(
            'element/getRecords',
            {
              elementName: 'checkout',
              query: `?query=substationid=="${item.substationid}"%26%26ordernumber=="${payload.ordernumber}"%26%26(substationresult==1%7C%7Csubstationresult==7)`,
            },
            { root: true },
          );
          console.log(checkout.length);
          const okcount = checkout.length;
          const partstatus = await dispatch(
            'element/getRecords',
            {
              elementName: 'partstatus',
              query: `?query=substationid=="${item.substationid}"%26%26ordernumber=="${payload.ordernumber}"%26%26(substationresult!=1%7C%7Csubstationresult!=7)`,
            },
            { root: true },
          );
          console.log(partstatus.length);
          const ngcount = partstatus.length;
          return {
            ...item,
            okcount,
            ngcount,
          };
        }));
      }
      // let listUpdated = [];
      // if (list && list.length) {
      //   listUpdated = list.map((l) => ({
      //     ...l,
      //   }));
      // }
      console.log(await listUpdated);
      commit('setSubStationWiseOrderCounts', listUpdated);
      return true;
    },
    getRunningOrder: async ({ dispatch, commit }, query) => {
      query = '?query=orderstatus=="Running"';
      const runningOrderList = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query,
        },
        { root: true },
      );
      const checkOut = await dispatch(
        'element/getRecords',
        { elementName: 'checkout' },
        { root: true },
      );
      const partStatus = await dispatch(
        'element/getRecords',
        { elementName: 'partstatus' },
        { root: true },
      );
      const stations = await dispatch(
        'element/getRecords',
        { elementName: 'station' },
        { root: true },
      );
      const substations = await dispatch(
        'element/getRecords',
        { elementName: 'substation' },
        { root: true },
      );
      runningOrderList.forEach(async (item) => {
        if (runningOrderList.length) {
          if (checkOut.length) {
            const matchOrder = checkOut
              .filter((o) => o.ordernumber === item.ordernumber);
            // console.log(matchOrder);
            const substationInfo = substations
              .filter((st) => st.id === matchOrder[0].substationid);
            // item.actualcount = actualUpdatecount[0].ordercount;
            // console.log(substationInfo);
            const stresult = substationInfo
              .filter((sr) => sr.substationresult === 7 || sr.substationresult === 1);
            const stationInfo = stations
              .filter((s) => s.id === substationInfo[0].stationid);
            // console.log(stationInfo);
            // console.log(stresult);
            // const modesOk = stresult
            //   .filter((ms) => ms.modestatus === 0);
            // console.log(modesOk);
            item.okcount = stresult.length;
            const stationname = stations
              .filter((o) => o.id === stationInfo[0].id);
            item.stationname = stationname[0].name;
          }
          if (partStatus.length) {
            const matchOrder = partStatus
              .filter((o) => o.ordernumber === item.ordernumber);
            const substationInfo = substations
              .filter((st) => st.id === matchOrder[0].substationid);
            // item.actualcount = actualUpdatecount[0].ordercount;
            const stresultPart = substationInfo
              .filter((sr) => sr.substationresult !== 1);
            const modesNg = stresultPart
              .filter((ms) => ms.modestatus === 0);
            item.ngcount = modesNg.length;
          }
        }
      });
      let orderUpdate = [];
      if (runningOrderList && runningOrderList.length) {
        orderUpdate = runningOrderList.map((l) => ({
          ...l,
        }));
      }
      commit('setrunningOrderList', orderUpdate);
      return true;
    },
    getProductDetailsRecord: async ({ dispatch, commit }) => {
      const productDetailsRecord = await dispatch(
        'element/getRecords',
        {
          elementName: 'productdetails',
        },
        { root: true },
      );
      commit('setProductDetailsRecord', productDetailsRecord);
    },
    getRoadMapDetailsRecord: async ({ dispatch, commit }) => {
      const roadMapDetailsRecord = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
        },
        { root: true },
      );
      commit('setRoadMapDetailsRecord', roadMapDetailsRecord);
    },
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
      return line;
    },
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
          list = orders;
          list = list.sort((a, b) => b.indexno - a.indexno);
          commit('setOrderList', list);
          return orders;
        }
      }
      return created;
    },

    updateOrder: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'order',
          queryParam: payload.query,
          payload: payload.payload,
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
      const orderCount = await dispatch(
        'element/getRecords',
        {
          elementName: 'ordercount',
          query: '',
        },
        { root: true },
      );
      orders.forEach(async (item) => {
        if (orderCount.length) {
          const actualUpdatecount = orderCount
            .filter((oc) => oc.ordernumber === item.ordernumber);
          item.actualcount = actualUpdatecount[0].ordercount;
        }
      });
      let orderUpdate = [];
      if (orders && orders.length) {
        orderUpdate = orders.map((l) => ({
          ...l,
        }));
      }
      return orderUpdate;
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
        if (list.length > 0) {
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
      }
    },

    getProductDetailsList: async ({ dispatch, commit }, query) => {
      const details = await dispatch(
        'element/getRecords',
        {
          elementName: 'productdetails',
          query,
        },
        { root: true },
      );
      if (details) {
        commit('setProductDetailList', details);
      }
      return details;
    },

    getRoadmapDetailsList: async ({ dispatch, commit }, query) => {
      const details = await dispatch(
        'element/getRecords',
        {
          elementName: 'roadmapdetails',
          query,
        },
        { root: true },
      );
      if (details) {
        commit('setRoadmapDetailList', details);
      }
      return details;
    },

    createBulkOrderProduct: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'orderproduct',
          payload,
        },
        { root: true },
      );
      return created;
    },

    createBulkOrderRoadmap: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'orderroadmap',
          payload,
        },
        { root: true },
      );
      return created;
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
        if (list.length > 0) {
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
      }
    },
    getHiddenOrderListRecords: async ({ dispatch, commit }, query) => {
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query: '?query=visible==false',
        },
        { root: true },
      );
      const partStatus = await dispatch(
        'element/getRecords',
        { elementName: 'partstatus' },
        { root: true },
      );
      const orderCount = await dispatch(
        'element/getRecords',
        {
          elementName: 'ordercount',
          query,
        },
        { root: true },
      );
      orders.forEach(async (item) => {
        if (orderCount.length) {
          const actualUpdatecount = orderCount
            .filter((oc) => oc.ordernumber === item.ordernumber);
          item.actualcount = actualUpdatecount[0].ordercount;
        }
        if (partStatus.length) {
          const okUpdatecount = partStatus
            .filter((mc) => mc.ordernumber === item.ordernumber);
          const over = okUpdatecount
            .filter((ov) => ov.overallresult === 1 || ov.overallresult === 7);
          const modes = over
            .filter((ms) => ms.modestatus === 0);
          const ngOverall = okUpdatecount
            .filter((ms) => ms.overallresult !== 1);
          const modesNg = ngOverall
            .filter((ms) => ms.modestatus === 0);
          item.okcount = modes.length;
          item.ngcount = modesNg.length;
        }
      });
      let orderUpdate = [];
      if (orders && orders.length) {
        orderUpdate = orders.map((l) => ({
          ...l,
        }));
      }
      commit('setOrderList', orderUpdate);
      return true;
    },
    getOrderListRecords: async ({ dispatch, commit }, query) => {
      const orders = await dispatch(
        'element/getRecords',
        {
          elementName: 'order',
          query: '?query=visible==true',
        },
        { root: true },
      );
      const partStatus = await dispatch(
        'element/getRecords',
        { elementName: 'partstatus' },
        { root: true },
      );
      const orderCount = await dispatch(
        'element/getRecords',
        {
          elementName: 'ordercount',
          query,
        },
        { root: true },
      );
      orders.forEach(async (item) => {
        if (orderCount.length) {
          const actualUpdatecount = orderCount
            .filter((oc) => oc.ordernumber === item.ordernumber);
          item.actualcount = actualUpdatecount[0].ordercount;
        }
        if (partStatus.length) {
          const okUpdatecount = partStatus
            .filter((mc) => mc.ordernumber === item.ordernumber);
          const over = okUpdatecount
            .filter((ov) => ov.overallresult === 1 || ov.overallresult === 7);
          const modes = over
            .filter((ms) => ms.modestatus === 0);
          const ngOverall = okUpdatecount
            .filter((ms) => ms.overallresult !== 1);
          const modesNg = ngOverall
            .filter((ms) => ms.modestatus === 0);
          item.okcount = modes.length;
          item.ngcount = modesNg.length;
        }
      });
      let orderUpdate = [];
      if (orders && orders.length) {
        orderUpdate = orders.map((l) => ({
          ...l,
        }));
      }
      commit('setOrderList', orderUpdate);
      return true;
    },
  },
  getters: {
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
