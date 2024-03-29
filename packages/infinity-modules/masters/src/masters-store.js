import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    assets: [],
    records: null,
    elements: [],
  },
  mutations: {
    setAssets: set('assets'),
    setRecords: set('records'),
    deleteRecord: (state, id) => {
      const { records } = state;
      // eslint-disable-next-line
      const index = records.findIndex((r) => r._id === id);
      if (index > -1) {
        records.splice(index, 1);
      }
    },
    setElements: set('elements'),
  },
  actions: {
    updateRecord: async ({ dispatch }, payloadData) => {
      const created = await dispatch(
        'element/updateRecordById',
        {
          elementName: payloadData.name,
          id: payloadData.query,
          payload: payloadData.payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    postBulkRecords: async ({ dispatch }, { payload, name }) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: name,
          payload,
        },
        { root: true },
      );
      if (created) {
        return true;
      }
      return false;
    },
    deleteRecord: async ({ commit, dispatch }, { id, name }) => {
      const deleteBomdetail = await dispatch(
        'element/deleteRecordById',
        {
          elementName: name,
          id,
        },
        { root: true },
      );
      if (deleteBomdetail) {
        commit('deleteRecord', id);
      }
      return deleteBomdetail;
    },
    getAssets: async ({ commit, dispatch }) => {
      const assets = await dispatch(
        'industry/getAssets',
        null,
        { root: true },
      );
      if (assets && assets.length) {
        commit('setAssets', assets);
      }
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

    getRecords: async ({ commit, dispatch }, {
      elementName,
      assetId,
    }) => {
      commit('setRecords', null);
      let payload = {
        elementName,
        query: `?query=assetid==${assetId}`,
      };
      if (!assetId) {
        payload = {
          elementName,
        };
      }
      const records = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (records) {
        commit('setRecords', records);
      }
    },

    getRecordsAfterUpdate: async ({ commit, dispatch }, {
      elementName,
      assetId,
    }) => {
      let payload = {
        elementName,
        query: `?query=assetid==${assetId}`,
      };
      if (!assetId) {
        payload = {
          elementName,
        };
      }
      const records = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (records) {
        commit('setRecords', records);
      }
    },
  },
  getters: {
    masterItems: ({ elements }) => {
      let list = [];
      if (elements && elements.length) {
        const provisioningElements = elements
          .map((elem) => elem.element)
          .filter((elem) => (
            elem.elementType.toUpperCase().trim() === 'PROVISIONING'
            && elem.categoryType.toUpperCase().trim() !== 'CALENDAR'
          ));
        const groupedElements = provisioningElements
          .reduce((acc, cur) => {
            acc[cur.categoryType] = [...acc[cur.categoryType] || [], cur];
            return acc;
          }, {});
        const groups = Object.keys(groupedElements);
        list = groups
          .map((group) => {
            const header = { header: group.toLowerCase() };
            const items = sortArray(provisioningElements, 'elementDescription')
              .map((elem) => {
                if (elem.categoryType === group) {
                  return {
                    title: elem.elementDescription,
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

    showTabs: ({ elements }) => (element) => {
      let show = false;
      if (elements && elements.length) {
        const elem = elements
          .find((e) => e.element.elementName === element);
        if (elem) {
          const { tags } = elem;
          const assets = tags.map((tag) => tag.assetId);
          const uniqueAssets = [...new Set(assets)];
          if (uniqueAssets && uniqueAssets.length > 1) {
            show = true;
          }
        }
      }
      return show;
    },

    getAssets: ({ elements, assets }) => (element) => {
      let result = [];
      if (elements && elements.length) {
        const elem = elements
          .find((e) => e.element.elementName === element);
        if (elem) {
          const { tags } = elem;
          const asts = tags.map((tag) => tag.assetId);
          const uniqueAssets = [...new Set(asts)];
          if (uniqueAssets && uniqueAssets.length > 1) {
            result = assets.filter((asset) => uniqueAssets.includes(asset.id));
          }
        }
      }
      return result;
    },

    getTags: ({ elements }) => (element, assetId) => {
      let tags = [];
      if (elements && elements.length) {
        const elem = elements.find((e) => e.element.elementName === element);
        if (elem) {
          ({ tags } = elem);
          tags = tags.filter((tag) => {
            if (assetId) {
              return !tag.hide && tag.assetId === assetId;
            }
            return !tag.hide;
          });
        }
      }
      return tags;
    },
  },
});
