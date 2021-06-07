import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';
import elementsAndTags from './data/elements';

export default ({
  namespaced: true,
  state: {
    logs: [],
    assets: [],
    records: [],
    logcodes: [],
    elements: [],
  },
  mutations: {
    setLogs: set('logs'),
    setAssets: set('assets'),
    setRecords: set('records'),
    setElements: set('elements'),
    setLogCodes: set('logcodes'),
  },
  actions: {
    initElements: async ({ dispatch }) => {
      const createElements = elementsAndTags.map(async (m) => {
        const { element, tags } = m;
        const e = await dispatch(
          'element/getElement',
          element.elementName,
          { root: true },
        );
        if (!e) {
          const payload = {
            element,
            tags,
          };
          await dispatch(
            'element/createElementAndTags',
            payload,
            { root: true },
          );
        }
      });
      await Promise.all(createElements);
    },
    getSwxLogs: async ({ dispatch, commit }, query) => {
      const logList = await dispatch(
        'element/getRecords',
        {
          elementName: 'swxlogs',
          query,
        },
        { root: true },
      );
      commit('setLogs', logList);
      return true;
    },
    getSwxLogCodes: async ({ dispatch, commit }) => {
      const codeList = await dispatch(
        'element/getRecords',
        {
          elementName: 'swxlogcodes',
        },
        { root: true },
      );
      commit('setLogCodes', codeList);
      return true;
    },
    updateRecord: async ({ dispatch, commit }, payloadData) => {
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
        const query = '';
        const record = await dispatch(
          'element/getRecords',
          {
            elementName: payloadData.name,
            query,
          },
          { root: true },
        );
        if (record) {
          commit('setRecords', record);
          // return record;
        }
      }
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
    deleteRecord: async ({ dispatch }, { id, name }) => {
      const deleteBomdetail = await dispatch(
        'element/deleteRecordById',
        {
          elementName: name,
          id,
        },
        { root: true },
      );
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
      // fromDate,
      // toDate,
      // pageSize,
      // pageNumber,
    }) => {
      let payload = {
        elementName,
        query: `?query=assetid==${assetId}`,
      };
      if (!assetId) {
        payload = {
          elementName,
          // fromDate,
          // toDate,
          // query: `?query=pagenumber==${pageNumber}&pagesize=${pageSize}`,
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
