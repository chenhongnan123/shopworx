import IndustryService from '@shopworx/services/api/industry.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  namespaced: true,
  state: {
    elementLoading: false,
    dataLoading: false,
    elementError: false,
    assets: [],
    elements: [],
    master: null,
    records: [],
  },
  mutations: {
    setElementLoading: set('elementLoading'),
    setDataLoading: set('dataLoading'),
    setElementError: set('elementError'),
    setAssets: set('assets'),
    setElements: set('elements'),
    setMaster: set('master'),
    setRecords: set('records'),
  },
  actions: {
    initMasterData: async ({ commit, rootState, dispatch }, elementName) => {
      commit('setElementLoading', true);
      let { me } = rootState.user;
      if (!me) {
        me = await dispatch('user/getMe', null, { root: true });
      }
      if (me) {
        const assets = await dispatch('getAssets');
        if (assets) {
          const master = await dispatch('element/getElement', elementName, { root: true });
          commit('setElementLoading', false);
          if (master) {
            commit('setDataLoading', true);
            commit('setElementError', false);
            commit('setMaster', master);
            const records = await dispatch('element/getRecords', { elementName }, { root: true });
            if (records && records.length) {
              commit('setRecords', records);
            }
            commit('setDataLoading', false);
          } else {
            commit('setElementError', true);
          }
        }
      }
    },

    getAssets: async ({ commit, rootState }) => {
      const { me } = rootState.user;
      const industryId = me && me.industry ? me.industry.id : null;
      try {
        const { data } = await IndustryService.getAssets();
        if (data && data.results) {
          const assets = data.results.filter((asset) => asset.industryId === industryId);
          commit('setAssets', assets);
        } else if (data && data.errors) {
          commit('helper/setAlert', {
            show: true,
            type: 'error',
            message: data.errors.errorCode,
          }, {
            root: true,
          });
          return false;
        }
      } catch (e) {
        console.error(e);
        return false;
      }
      return true;
    },

    getElements: async ({ commit, rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      const elements = await dispatch(
        'element/getElementsBySite',
        activeSite,
        { root: true },
      );
      if (elements && elements.length) {
        commit('setElements', elements);
      }
    },
  },
  getters: {
    formattedElements: ({ elements }) => {
      let list = [];
      if (elements && elements.length) {
        const provisioningElements = elements
          .map((elem) => elem.element)
          .filter((elem) => elem.elementType.toUpperCase().trim() === 'PROVISIONING');
        const groupedElements = provisioningElements
          .reduce((acc, cur) => {
            acc[cur.categoryType] = [...acc[cur.categoryType] || [], cur];
            return acc;
          }, {});
        const groups = Object.keys(groupedElements);
        list = groups
          .map((group) => {
            const header = { header: group.toLowerCase() };
            const items = provisioningElements
              .map((elem) => {
                if (elem.categoryType === group) {
                  return {
                    title: elem.elementName,
                    to: elem.elementName,
                    icon: `$${elem.elementName}`,
                  };
                }
                return null;
              })
              .filter((e) => e !== null);
            return [header, ...items];
          })
          .flat();
      }
      return list;
    },

    element: ({ master }) => {
      let elem = null;
      if (master) {
        elem = master.element;
      }
      return elem;
    },

    getTags: ({ master }) => (assetId = 0) => {
      let tags = [];
      if (master) {
        tags = master.tags.filter((tag) => (
          !tag.hide
          && tag.assetId === assetId
          && tag.status.toUpperCase().trim() === 'ACTIVE'
        ));
      }
      return tags;
    },

    getRecords: ({ records }) => (assetId = 0) => {
      let rec = [];
      if (records && records.length) {
        rec = records.filter((record) => record.assetId === assetId);
      }
      return rec;
    },
  },
});
