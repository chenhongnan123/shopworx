import { set } from '@shopworx/services/util/store.helper';
import { sortArray } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    assets: [],
    records: [],
    elements: [],
    paramList: [],
    chartType: null,
    report: null,
    dateRange: [new Date().toISOString().substr(0, 10),
      new Date().toISOString().substr(0, 10)],
    gridState: '',
    categoryList: [],
  },
  mutations: {
    setAssets: set('assets'),
    setRecords: set('records'),
    setElements: set('elements'),
    setChartType: set('chartType'),
    setReport: set('report'),
    setDateRange: set('dateRange'),
    setGridState: set('gridState'),
    setParamList: set('paramList'),
    setCategoryList: set('categoryList'),
  },
  actions: {
    getParameters: async ({ commit, dispatch }, substation) => {
      const list = [];
      const param = await dispatch(
        'element/getRecords',
        { elementName: 'parameters', query: `?query=showparameter==true%26%26substationid=="${substation}"` },
        { root: true },
      );
      if (param) {
        param.forEach((element) => {
          list.push(element.name);
        });
        commit('setParamList', list);
      }
      return param;
    },

    getParameterCatgory: async ({ commit, dispatch }, request) => {
      const param = await dispatch(
        'element/getRecords',
        { elementName: 'category', query: request.payload },
        { root: true },
      );
      if (param) {
        let list = [];
        list = await Promise.all(param.map(async (f) => {
          const paramList = await dispatch(
            'element/getRecords',
            { elementName: 'parameters', query: `?query=parametercategory=="${f.id}"%26%26substationid=="${request.substation}"` },
            { root: true },
          );
          return paramList.map((p) => p.name);
        }));
        commit('setParamList', list.flat());
      }
      return param;
    },

    getRecordsByTagData: async ({ commit, dispatch }, payload) => {
      let data = await dispatch(
        'element/getRecordsByTags',
        { payload },
        { root: true },
      );
      if (data) {
        commit('setRecords', data.results);
        data = {
          ...data,
          results: data.results.map((d) => ({
            ...d,
            id: d._id,
          })),
        };
      }
      return data;
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

    getRecords: async ({ commit, dispatch }, { elementName, request }) => {
      let payload = {
        elementName,
        query: request,
      };
      if (!request) {
        payload = {
          elementName,
        };
      }
      let data = await dispatch(
        'element/getRecordsWithCount',
        payload,
        { root: true },
      );
      if (data) {
        commit('setRecords', data.results);
        data = {
          ...data,
          results: data.results.map((d) => ({
            ...d,
            id: d._id,
          })),
        };
      }
      return data;
    },
  },
  getters: {
    masterItems: ({ elements }) => {
      let list = [];
      if (elements && elements.length) {
        const provisioningElements = elements
          .map((elem) => elem.element)
          .filter((elem) => (
            elem.elementType.toUpperCase().trim() !== 'PROVISIONING'
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
              return tag.assetId === assetId;
            }
            return !tag.hide;
          });
        }
      }
      return tags;
    },
  },
});
