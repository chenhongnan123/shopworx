import IndustryService from '@shopworx/services/api/industry.service';
import CustomerService from '@shopworx/services/api/customer.service';
import ElementService from '@shopworx/services/api/element.service';
import { set } from '@shopworx/services/util/store.service';

export default ({
  namespaced: true,
  state: {
    step: 1,
    assets: [],
    elements: [],
    currentAsset: 0,
    masterElements: [],
    onboardingItems: [],
  },
  mutations: {
    setStep: set('step'),
    setAssets: set('assets'),
    setElements: set('elements'),
    setCurrentAsset: set('currentAsset'),
    setMasterElements: set('masterElements'),
    setOnboardingItems: set('onboardingItems'),
  },
  actions: {
    getAssets: async ({ commit, rootState }) => {
      const { me } = rootState.user;
      const industryId = me && me.industry ? me.industry.id : null;
      const { data, status } = await IndustryService.getAssets();
      if (status === 200) {
        const assets = data.results.filter((asset) => asset.industryId === industryId);
        commit('setAssets', assets);
      }
      return data;
    },

    getMasterElements: async ({ commit, rootState }) => {
      const { me } = rootState.user;
      const industryId = me && me.industry ? me.industry.id : null;
      const { data, status } = await IndustryService.getMasterByIndustry(industryId);
      if (status === 200) {
        const masterElements = data.results.filter((elem) => elem.masterElement.onboardingRequired);
        commit('setMasterElements', masterElements);
      }
      return data;
    },

    getElements: async ({
      dispatch,
      commit,
      rootState,
      state,
    }) => {
      const { masterElements } = state;
      const { activeSite } = rootState.user;
      const { data, status } = await ElementService.getElementsBySite(activeSite);
      if (status === 200) {
        const masterElementNames = masterElements.map((elem) => elem.elementName);
        const elements = data.results
          .filter((elem) => masterElementNames.includes(elem.elementName));
        commit('setElements', elements);
        dispatch('getOnboardingElements');
      }
    },

    getOnboardingElements: ({ commit, getters, state }) => {
      const { assets, currentAsset } = state;
      const {
        filteredMasterElements,
        filteredElements,
        masterTagsByElement,
        tagsByElement,
      } = getters;
      let items = [];
      if (filteredMasterElements && filteredMasterElements.length) {
        let selectedAsset = currentAsset;
        const onboardingItems = filteredMasterElements.map((elem) => {
          let isComplete = false;
          let isEditable = elem.sequence === 1;
          let masterTags = masterTagsByElement(elem.elementName);
          const provisionedElement = filteredElements
            .find((e) => e.elementName === elem.elementName);
          if (provisionedElement) {
            const { assetBased } = provisionedElement;
            const tags = tagsByElement(provisionedElement.elementName);
            const tagsProvisioned = [];
            masterTags = masterTags.map((mTag) => {
              const { tagName } = mTag;
              let isProvisioned = false;
              const provisionedTagNames = tags.map((tag) => tag.tagName);
              if (provisionedTagNames.includes(tagName)) {
                isProvisioned = true;
              }
              return {
                ...mTag,
                isProvisioned,
              };
            });
            if (assetBased && assets && assets.length) {
              assets.forEach((asset, index) => {
                const { id } = asset;
                const existingTags = tags.filter((tag) => tag.assetId === id);
                if (existingTags && existingTags.length) {
                  tagsProvisioned.push('true');
                  selectedAsset = index + 1;
                }
              });
              if (tagsProvisioned.length === assets.length) {
                isComplete = true;
                isEditable = true;
                selectedAsset = 0;
              } else {
                isComplete = false;
                isEditable = true;
              }
            } else {
              isComplete = true;
              isEditable = true;
            }
          }
          return {
            element: elem,
            title: elem.elementName,
            step: elem.sequence,
            isOptional: elem.optional,
            type: elem.categoryType,
            isAssetBased: elem.assetBased,
            isComplete,
            isEditable,
            tags: masterTags,
          };
        });
        const lastCompleteItemIndex = onboardingItems
          .findIndex((item) => !item.isComplete && item.type.toUpperCase().trim() !== 'CALENDAR');
        if (lastCompleteItemIndex !== -1) {
          onboardingItems[lastCompleteItemIndex + 1] = {
            ...onboardingItems[lastCompleteItemIndex + 1],
            isEditable: true,
          };
          commit('setStep', lastCompleteItemIndex + 1);
        }
        const calendarItems = onboardingItems
          .filter((item) => item.type.toUpperCase().trim() === 'CALENDAR');
        const isComplete = calendarItems.every((item) => item.isComplete);
        const isEditable = calendarItems.some((item) => item.isEditable);
        const categories = calendarItems.map((item) => ({
          element: item.element,
          title: item.title,
          tags: item.tags.flat(),
        }));
        const { step, type } = calendarItems[0];
        const calendarItem = {
          title: 'calendar',
          step,
          type,
          isComplete,
          isEditable,
          categories,
        };
        const nonCalendarItems = onboardingItems
          .filter((item) => item.type.toUpperCase().trim() !== 'CALENDAR');
        items = [...nonCalendarItems, calendarItem];
        commit('setOnboardingItems', items);
        commit('setCurrentAsset', selectedAsset);
      }
      return items;
    },

    completeOnboarding: async ({ rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      const { data, status } = await CustomerService.completeOnboarding(activeSite);
      if (status === 200) {
        await dispatch('getMe', '', { root: true });
        return data.results.onboardingCompleted;
      }
      return false;
    },
  },
  getters: {
    filteredMasterElements: ({ masterElements }) => {
      let elems = [];
      if (masterElements && masterElements.length) {
        elems = masterElements
          .map((elem) => elem.masterElement)
          .sort((a, b) => a.sequence - b.sequence);
      }
      return elems;
    },

    masterTagsByElement: ({ masterElements }) => (elementName) => {
      let tags = [];
      if (masterElements && masterElements.length) {
        tags = masterElements
          .filter((elem) => elem.masterElement.elementName === elementName)
          .map((elem) => elem.masterTags)
          .flat();
      }
      return tags;
    },

    filteredElements: ({ elements }) => {
      let elems = [];
      if (elements && elements.length) {
        elems = elements.map((elem) => elem.element);
      }
      return elems;
    },

    tagsByElement: ({ elements }) => (elementName) => {
      let tags = [];
      if (elements && elements.length) {
        tags = elements
          .filter((elem) => elem.element.elementName === elementName)
          .map((elem) => elem.tags)
          .flat();
      }
      return tags;
    },
  },
});
