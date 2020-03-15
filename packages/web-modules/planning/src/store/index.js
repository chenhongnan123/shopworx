import IndustryService from '@shopworx/services/api/industry.service';
import ElementService from '@shopworx/services/api/element.service';
import { set, toggle } from '@shopworx/services/util/store.service';

export default ({
  namespaced: true,
  state: {
    step: 1,
    view: 0,
    plans: [],
    assets: [],
    elements: [],
    filter: false,
    currentAsset: 0,
    masterElements: [],
    onboardingItems: [],
    isOnboardingComplete: false,
  },
  mutations: {
    setStep: set('step'),
    setView: set('view'),
    setPlans: set('plans'),
    setAssets: set('assets'),
    setFilter: set('filter'),
    setElements: set('elements'),
    toggleFilter: toggle('filter'),
    setCurrentAsset: set('currentAsset'),
    setMasterElements: set('masterElements'),
    setOnboardingItems: set('onboardingItems'),
    setIsOnboardingComplete: set('isOnboardingComplete'),
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
          const masterElements = data.results;
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
      const { assets, currentAsset, step } = state;
      const {
        filteredMasterElements,
        filteredElements,
        masterTagsByElement,
        tagsByElement,
      } = getters;
      let items = [];
      if (filteredMasterElements && filteredMasterElements.length) {
        let selectedAsset = currentAsset;
        items = filteredMasterElements.map((elem, n) => {
          let isComplete = false;
          let isEditable = n === 0;
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
            step: n + 1,
            isAssetBased: elem.assetBased,
            isComplete,
            isEditable,
            tags: masterTags,
          };
        });
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
        if (step > items.length) {
          commit('isOnboardingComplete', true);
        }
        commit('setOnboardingItems', items);
        commit('setCurrentAsset', selectedAsset);
      }
      return items;
    },

    getPlans: async ({ commit }) => {
      const { data, status } = await ElementService.getElementRecords(
        'planning',
      );
      if (status === 200) {
        commit('setPlans', data.results);
      }
      return data;
    },
  },
  getters: {
    filteredMasterElements: ({ masterElements }) => {
      let elems = [];
      if (masterElements && masterElements.length) {
        const elements = ['ASSETPARTMATRIX', 'PLANNING'];
        elems = masterElements
          .map((elem) => elem.masterElement)
          .filter((elem) => elements.includes(elem.elementName.toUpperCase().trim()))
          .sort((a, b) => {
            if (a.elementName < b.elementName) { return -1; }
            if (a.elementName > b.elementName) { return 1; }
            return 0;
          });
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
        const filteredElems = ['ASSETPARTMATRIX', 'PLANNING'];
        elems = elements
          .map((elem) => elem.element)
          .filter((elem) => filteredElems.includes(elem.elementName.toUpperCase().trim()));
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
