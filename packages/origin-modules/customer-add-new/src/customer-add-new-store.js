import { set, reactiveSet, reactiveSetArray } from '@shopworx/services/util/store.helper';
import IndustryService from '@shopworx/services/api/industry.service';
import CustomerService from '@shopworx/services/api/customer.service';
import SiteService from '@shopworx/services/api/site.service';

export default ({
  namespaced: true,
  state: {
    customerData: {
      1: {
        data: null,
        isComplete: false,
      },
      2: {
        data: null,
        isComplete: false,
      },
      3: {
        data: null,
        isComplete: false,
      },
    },
    onboardingSteps: [{
      name: 'SMS settings',
      component: 'sms',
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Web apps',
      component: 'apps',
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Reports',
      component: 'reports',
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Report views',
      component: 'report-views',
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Insight categories',
      component: 'insight-categories',
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Insight views',
      component: 'insight-views',
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Roles',
      component: 'roles',
      isComplete: false,
      isLoading: false,
    }],
    industries: [],
    selectedIndustry: null,
    assets: [],
    masterElementsAndTags: [],
  },
  mutations: {
    setCustomerData: set('customerData'),
    updateCustomerData: reactiveSet('customerData'),
    setIndustries: set('industries'),
    setSelectedIndustry: set('selectedIndustry'),
    setAssets: set('assets'),
    setMasterElementsAndTags: set('masterElementsAndTags'),
    updateOnboardingSteps: reactiveSetArray('onboardingSteps'),
  },
  actions: {
    getIndustries: async ({ commit }) => {
      try {
        const { data } = await IndustryService.getIndustries();
        if (data && data.results) {
          commit('setIndustries', data.results);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    getAssets: async ({ commit, state }) => {
      try {
        const { selectedIndustry } = state;
        const { data } = await IndustryService.getAssets();
        if (data && data.results) {
          const assets = data.results
            .filter((a) => a.industryId === parseInt(selectedIndustry, 10));
          commit('setAssets', assets);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    getMasterElementsAndTags: async ({ commit, state }) => {
      try {
        const { selectedIndustry } = state;
        const { data } = await IndustryService.getMasterByIndustry(selectedIndustry);
        if (data && data.results) {
          commit('setMasterElementsAndTags', data.results);
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createCustomer: async (_, payload) => {
      try {
        const { data } = await CustomerService.addCustomer(payload);
        if (data && data.created) {
          return { id: data.customerId };
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    createSite: async ({ dispatch }, { siteName, payload }) => {
      try {
        const { data } = await CustomerService.addSite(siteName, payload);
        if (data && data.created) {
          const active = await dispatch('setActiveCustomer', payload.customerId);
          if (active) {
            return { id: active.siteId };
          }
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    setActiveCustomer: async (_, customerId) => {
      try {
        const { data } = await CustomerService.setActiveCustomer(customerId);
        if (data && data.results) {
          return data.results;
        }
      } catch (e) {
        return false;
      }
      return false;
    },

    addLicense: async (_, payload) => {
      try {
        const { data } = await SiteService.addLicense(payload);
        if (data && data.created) {
          return data.created;
        }
      } catch (e) {
        return false;
      }
      return false;
    },
  },
  getters: {
    machineElement: ({ masterElementsAndTags }) => (assetId) => {
      let elem = {
        element: null,
        tags: [],
      };
      if (masterElementsAndTags && masterElementsAndTags.length) {
        const masterElem = masterElementsAndTags
          .find((m) => m.masterElement.elementName === 'machine');
        elem = {
          element: masterElem.masterElement,
          tags: masterElem.masterTags
            .filter((t) => t.assetId === assetId)
            .sort((a, b) => a.id - b.id),
        };
      }
      return elem;
    },

    meterElement: ({ masterElementsAndTags }) => (assetId) => {
      let elem = {
        element: null,
        tags: [],
      };
      if (masterElementsAndTags && masterElementsAndTags.length) {
        const masterElem = masterElementsAndTags
          .find((m) => m.masterElement.elementName === 'meter');
        if (masterElem) {
          elem = {
            element: masterElem.masterElement,
            tags: masterElem.masterTags
              .filter((t) => t.assetId === assetId)
              .sort((a, b) => a.id - b.id),
          };
        }
      }
      return elem;
    },
  },
});
