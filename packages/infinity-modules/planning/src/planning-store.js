import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    partMatrixMaster: [],
  },
  mutations: {
    setPartMatrixMaster: set('partMatrixMaster'),
  },
  actions: {
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
        const filteredMasterElements = masterElements
          .filter((elem) => elem.masterElement.elementName === 'assetpartmatrix')
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
                const partMatrix = partMatrixElements.map((matrix) => {
                  const e = masterElements
                    .find((master) => master.masterElement.elementName === matrix.elementName);
                  const tag = e.masterTags
                    .filter((t) => t.assetId === provisionedAsset)
                    .find((t) => t.tagName === matrix.primaryTag);
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
        console.log(await Promise.all(filteredMasterElements));
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
                assetId,
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
  },
  getters: {
    planningSchema: (_, __, rootState, rootGetters) => {
      const { appSchema } = rootState.webApp;
      const licensedAssets = rootGetters['user/licensedAssets'];
      console.log(appSchema);
      console.log(licensedAssets);
      /* if (appSchema) {
        return appSchema.filter((schema) => licensedAssets.includes(schema.assetId));
      } */
      // TODO: remove static return;
      return [{
        assetId: 2,
        partMatrixComposition: [{
          elementName: 'part',
          primaryTag: 'partname',
        }, {
          elementName: 'machine',
          primaryTag: 'name',
        }, {
          elementName: 'mold',
          primaryTag: 'moldname',
        }],
      }, {
        assetId: 3,
        partMatrixComposition: [{
          elementName: 'part',
          primaryTag: 'partname',
        }, {
          elementName: 'machine',
          primaryTag: 'name',
        }, {
          elementName: 'tool',
          primaryTag: 'toolname',
        }],
      }];
    },

    partMatrixComposition: (_, { planningSchema }) => (assetId) => {
      if (planningSchema && planningSchema.length) {
        return planningSchema
          .filter((schema) => schema.assetId === assetId)
          .map((schema) => schema.partMatrixComposition)
          .flat();
      }
      return [];
    },
  },
});
