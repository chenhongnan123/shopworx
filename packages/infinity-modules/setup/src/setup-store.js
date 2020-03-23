import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    masterData: [],
  },
  mutations: {
    setMasterData: set('masterData'),
  },
  actions: {
    getMasterData: async ({ commit, dispatch }) => {
      const masterElements = await dispatch('getMasterElements');
      if (masterElements) {
        commit('setMasterData', masterElements);
        return true;
      }
      return false;
    },

    getMasterElements: async ({ dispatch }) => {
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
          .filter((elem) => (
            elem.masterElement.onboardingRequired
            && elem.masterElement.categoryType.toUpperCase().trim() !== 'CALENDAR'
          ))
          .map((elem) => {
            if (elem.masterElement.assetBased) {
              if (masterAssets && masterAssets.length) {
                const availableAssets = elem.masterTags.map((tag) => tag.assetId);
                const provisionedAssets = [...new Set(availableAssets)];
                return provisionedAssets.map((provisionedAsset) => {
                  const tags = elem.masterTags.filter((tag) => tag.assetId === provisionedAsset);
                  const { assetName, assetDescription } = masterAssets
                    .find((asset) => asset.id === provisionedAsset);
                  return {
                    tags,
                    success: false,
                    loading: false,
                    assetId: provisionedAsset,
                    element: elem.masterElement,
                    title: `${elem.masterElement.elementDescription} - ${assetDescription}`,
                    expectedFileName: `${elem.masterElement.elementName}-${assetName}.csv`,
                  };
                });
              }
            }
            return {
              assetId: 0,
              success: false,
              loading: false,
              tags: elem.masterTags,
              element: elem.masterElement,
              title: elem.masterElement.elementDescription,
              expectedFileName: `${elem.masterElement.elementName}.csv`,
            };
          });
        return filteredMasterElements.flat();
      }
      return false;
    },

    getElementRecords: async ({ dispatch }, { elementName, assetId }) => {
      const elem = await dispatch(
        'element/getElement',
        elementName,
        { root: true },
      );
      if (elem) {
        const records = await dispatch(
          'element/getRecords',
          { elementName, assetId },
          { root: true },
        );
        if (records && records.length) {
          return records;
        }
      }
      return false;
    },
  },
});
