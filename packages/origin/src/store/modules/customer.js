import CustomerService from '@shopworx/services/api/customer.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    contextDialog: false,
    customers: [],
    customerSites: [],
    selectedCustomer: null,
    selectedCustomerSite: null,
  },
  mutations: {
    setContextDialog: set('contextDialog'),
    setCustomers: set('customers'),
    setCustomerSites: set('customerSites'),
    setSelectedCustomer: set('selectedCustomer'),
    setSelectedCustomerSite: set('selectedCustomerSite'),
  },
  actions: {
    getContextDetails: async ({ dispatch }) => {
      try {
        const customers = await dispatch('getCustomers');
        if (customers && customers.length === 1) {
          dispatch('setActiveCustomer', customers[0]);
          const customerSites = await dispatch('getCustomerSites', customers[0].id);
          if (customerSites && customerSites.length === 1) {
            dispatch('setActiveSite', customerSites[0]);
          }
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getCustomers: async ({ commit }) => {
      try {
        const { data } = await CustomerService.getCustomers();
        if (data && data.results) {
          commit('setCustomers', data.results);
          return data.results;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    getCustomerSites: async ({ commit }, customerId) => {
      commit('setCustomerSites', []);
      try {
        const { data } = await CustomerService.getCustomerSites(customerId);
        if (data && data.results) {
          commit('setCustomerSites', data.results);
          return data.results;
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    setActiveCustomer: async (_, selectedCustomer) => {
      try {
        const { data } = await CustomerService.setActiveCustomer(selectedCustomer.id);
        return data.results;
      } catch (e) {
        return false;
      }
    },

    setActiveSite: async (_, selectedCustomerSite) => {
      try {
        const { data } = await CustomerService.setActiveSite(selectedCustomerSite.id);
        return data.results;
      } catch (e) {
        return false;
      }
    },
  },
  getters: {},
});
