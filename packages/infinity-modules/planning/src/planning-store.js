import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    parts: [],
    onboarded: false,
    planningMaster: null,
    partMatrixMaster: [],
    partMatrixRecords: [],
    planningElement: null,
  },
  mutations: {
    setParts: set('parts'),
    setOnboarded: set('onboarded'),
    setPlanningMaster: set('planningMaster'),
    setPartMatrixMaster: set('partMatrixMaster'),
    setPartMatrixRecords: set('partMatrixRecords'),
    setPlanningElement: set('planningElement'),
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

    planningTags: ({ planningElement }) => (assetId) => {
      let tags = [];
      if (planningElement && assetId) {
        tags = planningElement.tags.filter((tag) => tag.assetId === assetId);
      }
      console.log(tags);
      return tags;
    },

    filteredPartMatrixRecords: ({ partMatrixRecords }) => (filter) => {
      let records = partMatrixRecords;
      if (filter) {
        records = partMatrixRecords.filter((record) => record[filter.name] === filter.value);
      }
      console.log(filter, records);
      return records;
    },
  },
});
