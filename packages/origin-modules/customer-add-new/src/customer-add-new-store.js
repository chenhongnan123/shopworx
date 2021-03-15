import { set, reactiveSet } from '@shopworx/services/util/store.helper';
import IndustryService from '@shopworx/services/api/industry.service';

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
      4: {
        data: null,
        isComplete: false,
      },
    },
    onboardingSteps: [{
      name: 'Customer',
      payload: null,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Site',
      payload: {},
      isComplete: false,
      isLoading: false,
    }, {
      name: 'SMS settings',
      payload: {},
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Assets',
      assets: [{
        payload: {},
        isComplete: false,
        isLoading: false,
      }],
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Web apps',
      payload: {},
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Reports',
      payload: {},
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Report views',
      payload: {},
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Insight categories',
      payload: {},
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Insight views',
      payload: {},
      total: 0,
      completed: 0,
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Roles',
      roles: [{
        payload: {},
        isComplete: false,
        isLoading: false,
      }],
      isComplete: false,
      isLoading: false,
    }, {
      name: 'Admin user',
      payload: {},
      isComplete: false,
      isLoading: false,
    }],
    industries: [],
    selectedIndustry: null,
    assets: [],
  },
  mutations: {
    setCustomerData: set('customerData'),
    updateCustomerData: reactiveSet('customerData'),
    setIndustries: set('industries'),
    setSelectedIndustry: set('selectedIndustry'),
    setAssets: set('assets'),
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
  },
});
