import Vue from 'vue';
import SiteService from '@shopworx/services/api/site.service';
import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    appSchema: null,
    activeAppId: null,
    config: {
      filters: {},
      sort: {},
      group: [],
    },
    storageLocation: {
      planning: 'planningConfig',
      production: 'productionConfig',
      downtime: 'downtimeConfig',
    },
  },
  mutations: {
    setAppSchema: set('appSchema'),
    setActiveAppId: set('activeAppId'),
    setConfig: set('config'),
    resetConfig: (state) => {
      const { config } = state;
      Vue.set(config, 'filters', {});
      Vue.set(config, 'sort', {});
      Vue.set(config, 'group', []);
    },
    setFilter: (state, { field, value }) => {
      const { config: { filters } } = state;
      Vue.set(filters, field, value);
    },
    setSort: (state, { field, value }) => {
      const { config: { sort } } = state;
      Vue.set(sort, field, value);
    },
    setGroup: (state, value) => {
      const { config } = state;
      Vue.set(config, 'group', [...value]);
    },
  },
  actions: {
    getAppSchema: async ({ commit, state, rootState }, appId = null) => {
      try {
        const { me } = rootState.user;
        const roleId = me.role.id;
        let activeAppId = appId;
        if (!appId) {
          ({ activeAppId } = state);
        }
        const { data } = await SiteService.getApp(roleId, activeAppId);
        if (data && data.results) {
          try {
            commit('setAppSchema', JSON.parse(data.results.schema));
          } catch (e) {
            /* commit('helper/setAlert', {
              show: true,
              type: 'error',
              message: 'INVALID_APP_SCHEMA',
            }, {
              root: true,
            }); */
          }
        }
      } catch (e) {
        return false;
      }
      return true;
    },
  },
  getters: {
    filters: ({ config }) => config.filters,
    sort: ({ config }) => config.sort,
    group: ({ config }) => config.group,
    filteredRecords: (_, { filters }) => (records) => {
      let filteredRecords = records;
      Object
        .keys(filters)
        .filter((f) => f !== 'date')
        .forEach((filter) => {
          const { value, operation } = filters[filter];
          const isTypeString = typeof value === 'string';
          const isTypeBoolean = typeof value === 'boolean';
          const isTypeNumber = typeof value === 'number';
          const isTypeArray = Array.isArray(value);
          const applyStringFilter = isTypeString && !value.includes('All');
          filteredRecords = filteredRecords
            .filter((record) => {
              const valueExists = record[filter] !== undefined;
              if (applyStringFilter) {
                if (operation === 'eq') {
                  return record[filter] === value;
                }
                if (operation === 'neq') {
                  return record[filter] !== value;
                }
                if (operation === 'exists') {
                  return valueExists && record[filter] !== '';
                }
                if (operation === 'notexists') {
                  return !valueExists || record[filter] === '';
                }
              }
              if (isTypeBoolean) {
                if (operation === 'eq' && value) {
                  return record[filter] === value;
                }
              }
              if (isTypeArray) {
                if (operation === 'includes') {
                  return value.includes(record[filter]);
                }
              }
              if (valueExists && isTypeNumber) {
                if (operation === 'eq') {
                  return record[filter] === value;
                }
                if (operation === 'neq') {
                  return record[filter] !== value;
                }
                if (operation === 'gte') {
                  return record[filter] >= value;
                }
                if (operation === 'gt') {
                  return record[filter] > value;
                }
                if (operation === 'lte') {
                  return record[filter] <= value;
                }
                if (operation === 'lt') {
                  return record[filter] < value;
                }
              }
              return record;
            });
        });
      return filteredRecords;
    },
    sortedRecords: (_, { sort }) => (records) => {
      let sortedRecords = records;
      Object
        .keys(sort)
        .forEach((s) => {
          sortedRecords = sortedRecords
            .sort((a, b) => {
              if (sort[s] === 'DESC') {
                return b[s] - a[s];
              }
              return a[s] - b[s];
            });
        });
      return sortedRecords;
    },
    groupedRecords: (_, { group }) => (records) => {
      let groupedRecords = records;
      group.forEach((g) => {
        groupedRecords = groupedRecords
          .reduce((result, currentValue) => {
            const key = currentValue[g];
            if (!result[key]) {
              result[key] = {};
              result[key].values = [];
            }
            result[key].values = [
              ...result[key].values,
              currentValue,
            ];
            return result;
          }, {});
      });
      return groupedRecords;
    },
  },
});
