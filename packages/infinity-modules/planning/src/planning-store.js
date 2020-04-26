import HourService from '@shopworx/services/api/hour.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    parts: [],
    assets: [],
    onboarded: false,
    addPlanDialog: false,
    planningMaster: null,
    partMatrixMaster: [],
    partMatrixRecords: [],
    planningElement: null,
    primaryMatrixTags: [],
    partMatrixElement: null,
    notStartedPlanCount: 0,
  },
  mutations: {
    setParts: set('parts'),
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
  },
  actions: {
    getPlanningElement: async ({ commit, dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'planning',
        { root: true },
      );
      if (element) {
        commit('setPlanningElement', element);
        const matrix = await dispatch('getPartMatrixElement');
        if (matrix) {
          return true;
        }
      }
      return false;
    },

    getPartMatrixElement: async ({ commit, dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'partmatrix',
        { root: true },
      );
      if (element) {
        commit('setPartMatrixElement', element);
        const assets = await dispatch('getAssets');
        if (assets) {
          return true;
        }
      }
      return false;
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

    getPlanningMaster: async ({ commit, dispatch }) => {
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        const planningMaster = masterElements
          .find((elem) => elem.masterElement.elementName === 'planning');
        commit('setPlanningMaster', planningMaster);
        return true;
      }
      return false;
    },

    createPlanningElement: async ({ dispatch, state }) => {
      const { planningMaster } = state;
      const partMatrix = await dispatch(
        'element/getElement',
        'partmatrix',
        { root: true },
      );
      if (partMatrix) {
        const element = planningMaster.masterElement;
        const tags = [
          ...partMatrix.tags.filter((tag) => !tag.hide),
          ...planningMaster.masterTags,
        ];
        const payload = {
          element,
          tags,
        };
        const success = await dispatch(
          'element/createElementAndTags',
          payload,
          { root: true },
        );
        return success;
      }
      return false;
    },

    getPartMatrixMaster: async ({
      commit,
      dispatch,
      rootGetters,
      getters,
    }, { generateData = false }) => {
      const licensedAssets = rootGetters['user/licensedAssets'];
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      const masterAssets = await dispatch(
        'industry/getAssets',
        null,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        const planningMaster = masterElements
          .find((elem) => elem.masterElement.elementName === 'planning');
        commit('setPlanningMaster', planningMaster);
        const filteredMasterElements = masterElements
          .filter((elem) => elem.masterElement.elementName === 'partmatrix')
          .map((elem) => {
            const availableAssets = elem.masterTags.map((tag) => tag.assetId);
            const provisionedAssets = [...new Set(availableAssets)];
            return provisionedAssets
              .filter((asset) => licensedAssets.includes(asset))
              .map(async (provisionedAsset) => {
                const tags = elem.masterTags.filter((tag) => tag.assetId === provisionedAsset);
                const { assetName, assetDescription } = masterAssets
                  .find((asset) => asset.id === provisionedAsset);
                const partMatrixElements = getters.partMatrixComposition(provisionedAsset);
                const partMatrix = partMatrixElements.map((element) => {
                  const e = masterElements
                    .find((master) => master.masterElement.elementName === element);
                  const tag = e.masterTags
                    .filter((t) => t.assetId === provisionedAsset)
                    .find((t) => t.tagName === e.masterElement.uniqueTagName);
                  return {
                    tag,
                    element: e.masterElement.elementName,
                    tagName: tag.tagName,
                    tagDescription: tag.tagDescription,
                  };
                });
                let data = [];
                if (generateData) {
                  data = await dispatch('generateMatrix', {
                    matrixMaster: partMatrix,
                    assetId: provisionedAsset,
                  });
                }
                return {
                  tags: [...partMatrix.map((t) => t.tag), ...tags.filter((t) => !t.hide)],
                  hiddenTags: tags.filter((t) => t.hide),
                  success: false,
                  loading: false,
                  data,
                  assetId: provisionedAsset,
                  element: elem.masterElement,
                  title: `${elem.masterElement.elementDescription} - ${assetDescription}`,
                  expectedFileName: `${elem.masterElement.elementName}-${assetName}.csv`,
                };
              });
          }).flat();
        commit('setPartMatrixMaster', await Promise.all(filteredMasterElements));
        return true;
      }
      return false;
    },

    generateMatrix: async ({ dispatch }, { matrixMaster, assetId }) => {
      let result = [];
      if (matrixMaster && matrixMaster.length) {
        const getAllRecords = matrixMaster
          .map(async (master) => {
            const { element, tagName, tagDescription } = master;
            const data = await dispatch(
              'element/getRecords',
              {
                elementName: element,
                query: `?query=assetid==${assetId}`,
              },
              { root: true },
            );
            return data.map((d) => ({
              [tagDescription]: d[tagName],
            }));
          });
        const records = await Promise.all(getAllRecords);
        result = records.reduce((acc, cur) => acc
          .flatMap((x) => cur.map((y) => ({ ...x, ...y }))), [[]]);
      }
      return result;
    },

    getParts: async ({ commit, dispatch }) => {
      const parts = await dispatch(
        'element/getRecords',
        { elementName: 'part' },
        { root: true },
      );
      if (parts && parts.length) {
        commit('setParts', parts);
      }
    },

    getPartMatrixRecords: async ({ commit, dispatch }, { partname }) => {
      const payload = {
        elementName: 'partmatrix',
        query: `?query=partname=="${partname}"`,
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

    createPlan: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postRecord',
        {
          elementName: 'planning',
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

    getPlanningRecords: async ({ dispatch }, query) => {
      const plans = await dispatch(
        'element/getRecords',
        {
          elementName: 'planning',
          query,
        },
        { root: true },
      );
      return plans;
    },

    getScheduledEnd: async (_, { start, end }) => {
      let scheduledEnd = 0;
      console.log({ start, end });
      const { data } = await HourService.getNonWorkingTime(start, end);
      if (data && data.results) {
        scheduledEnd = end + data.results.nonWorkingTime;
      }
      return scheduledEnd;
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
