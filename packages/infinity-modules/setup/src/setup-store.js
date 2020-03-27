import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    masterData: [],
    calendarData: [],
  },
  mutations: {
    setMasterData: set('masterData'),
    setCalendarData: set('calendarData'),
  },
  actions: {
    getMasterData: async ({ commit, dispatch }) => {
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
                    tags: tags.filter((t) => !t.hide),
                    hiddenTags: tags.filter((t) => t.hide),
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
              hiddenTags: elem.masterTags.filter((t) => t.hide),
              tags: elem.masterTags.filter((t) => !t.hide),
              element: elem.masterElement,
              title: elem.masterElement.elementDescription,
              expectedFileName: `${elem.masterElement.elementName}.csv`,
            };
          });
        commit('setMasterData', filteredMasterElements.flat());
        return true;
      }
      return false;
    },

    getCalendarData: async ({ commit, dispatch }) => {
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        const calendarData = masterElements
          .filter((elem) => (
            elem.masterElement.onboardingRequired
            && elem.masterElement.categoryType.toUpperCase().trim() === 'CALENDAR'
          ))
          .map((elem) => ({
            assetId: 0,
            tags: elem.masterTags,
            element: elem.masterElement,
            title: elem.masterElement.elementDescription,
            expectedFileName: `${elem.masterElement.elementName}.csv`,
          }));
        commit('setCalendarData', calendarData);
        return true;
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

    completeOnboarding: async ({ rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      let success = false;
      try {
        const { data } = await SiteService.completeOnboarding(activeSite);
        if (data && data.results) {
          success = await dispatch('user/getMe', null, { root: true });
        }
      } catch (e) {
        return false;
      }
      return success;
    },
  },
});
