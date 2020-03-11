import IndustryService from '@shopworx/services/api/industry.service';
import CustomerService from '@shopworx/services/api/customer.service';
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
    initOnboarding: async ({ rootState, dispatch }) => {
      let { me } = rootState.user;
      if (!me) {
        me = await dispatch('user/getMe', null, { root: true });
      }
      if (me) {
        const assets = await dispatch('getAssets');
        if (assets) {
          const master = await dispatch('getMasterElements');
          if (master) {
            await dispatch('getElements');
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

    getMasterElements: async ({ commit, rootState }) => {
      const { me } = rootState.user;
      const industryId = me && me.industry ? me.industry.id : null;
      try {
        const { data } = await IndustryService.getMasterByIndustry(industryId);
        if (data && data.results) {
          const masterElements = data.results
            .filter((elem) => elem.masterElement.onboardingRequired);
          commit('setMasterElements', masterElements);
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

    getElements: async ({
      dispatch,
      commit,
      rootState,
      state,
    }) => {
      const { masterElements } = state;
      const { activeSite } = rootState.user;
      try {
        const elements = await dispatch(
          'element/getElementsBySite',
          activeSite,
          { root: true },
        );
        if (elements && elements.length) {
          const masterElementNames = masterElements.map((elem) => elem.elementName);
          const elems = elements
            .filter((elem) => masterElementNames.includes(elem.elementName));
          commit('setElements', elems);
          dispatch('getOnboardingElements');
        }
      } catch (e) {
        console.error(e);
      }
    },

    getOnboardingElements: ({ commit, getters, state }) => {
      commit('setStep', 1);
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
        const lastNonCompleteIndex = items
          .findIndex((item, index) => (
            !item.isComplete
            && index < items.length
          ));
        const lastCompleteItemIndex = lastNonCompleteIndex - 1;
        if (lastCompleteItemIndex > -1) {
          items[lastCompleteItemIndex + 1] = {
            ...items[lastCompleteItemIndex + 1],
            isEditable: true,
          };
          commit('setStep', lastCompleteItemIndex + 2);
        }
        commit('setOnboardingItems', items);
        commit('setCurrentAsset', selectedAsset);
      }
      return items;
    },

    completeOnboarding: async ({ rootState, dispatch }) => {
      const { activeSite } = rootState.user;
      let success = false;
      try {
        const { data } = await CustomerService.completeOnboarding(activeSite);
        if (data && data.results) {
          success = await dispatch('user/getMe', null, { root: true });
        }
      } catch (e) {
        console.error(e);
      }
      return success;
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
