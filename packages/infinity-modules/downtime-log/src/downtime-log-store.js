import { set, toggle } from '@shopworx/services/util/store.helper';
import { sortAlphaNum } from '@shopworx/services/util/sort.service';

export default ({
  namespaced: true,
  state: {
    masterData: [],
    drawer: false,
    onboarded: true,
    machines: [],
    shifts: [],
    downtimeList: [],
    loading: false,
    error: false,
    downtimeReasons: [],
    downtimeCount: 0,
    toggleSelection: false,
    selectedDowntimes: [],
  },
  mutations: {
    setMasterData: set('masterData'),
    setSelectedDowntimes: set('selectedDowntimes'),
    setToggleSelection: set('toggleSelection'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setOnboarded: set('onboarded'),
    setMachines: set('machines'),
    setShifts: set('shifts'),
    setLoading: set('loading'),
    setError: set('error'),
    setDowntimeReasons: set('downtimeReasons'),
    setDowntimeCount: set('downtimeCount'),
    setDowntimeList: set('downtimeList'),
  },
  actions: {
    getOnboardingState: async ({ commit, dispatch }) => {
      const isDowntimeReasonElementAvailable = await dispatch('getDowntimeReasonsElement');
      if (isDowntimeReasonElementAvailable) {
        commit('setOnboarded', true);
      } else {
        commit('setOnboarded', false);
      }
    },

    getMasterData: async ({
      commit,
      dispatch,
      rootGetters,
    }) => {
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
          .filter((elem) => elem.masterElement.elementName === 'downtimereasons')
          .map((elem) => {
            if (elem.masterElement.assetBased) {
              if (masterAssets && masterAssets.length) {
                const availableAssets = elem.masterTags.map((tag) => tag.assetId);
                const provisionedAssets = [...new Set(availableAssets)];
                return provisionedAssets
                  .filter((asset) => licensedAssets.includes(asset))
                  .map((provisionedAsset) => {
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

    getDowntimeReasonsElement: async ({ dispatch }) => {
      const downtimeReasonsElement = await dispatch(
        'element/getElement',
        'downtimereasons',
        { root: true },
      );
      return downtimeReasonsElement;
    },

    fetchMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'machine',
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setMachines', records);
        return true;
      }
      return false;
    },

    fetchShifts: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'businesshours',
          query: '?sortquery=sortindex==1',
        },
        { root: true },
      );
      if (records && records.length) {
        const allShifts = records.filter((rec) => rec.type === 'shift');
        const shiftList = [...new Set(allShifts.map((item) => item.name))];
        commit('setShifts', shiftList);
        return true;
      }
      return false;
    },

    fetchDowntimeReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'downtimereasons' },
        { root: true },
      );
      if (records) {
        commit('setDowntimeReasons', records);
        return true;
      }
      return false;
    },

    fetchDowntimeList: async ({ commit, dispatch, rootGetters }) => {
      const filters = rootGetters['webApp/filters'];
      const date = parseInt(filters.date.value.replace(/-/g, ''), 10);
      commit('setLoading', true);
      commit('setDowntimeList', []);
      commit('setError', false);
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'downtime',
          query: `?query=date==${date}`,
        },
        { root: true },
      );
      if (data && data.results) {
        commit('setDowntimeList', data.results);
        commit('setDowntimeCount', data.totalCount);
        commit('setError', false);
      } else {
        commit('setDowntimeList', []);
        commit('setDowntimeCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    updateReason: async ({ dispatch, commit, state }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'downtime',
          id,
          payload,
        },
        { root: true },
      );
      if (updated) {
        let { downtimeList } = state;
        downtimeList = downtimeList.map((dt) => {
          // eslint-disable-next-line
          if (dt._id === id) {
            return {
              ...dt,
              ...payload,
            };
          }
          return dt;
        });
        commit('setDowntimeList', []);
        commit('setDowntimeList', downtimeList);
        commit('helper/setAlert', {
          show: true,
          type: 'success',
          message: 'DOWNTIME_UPDATE',
        }, {
          root: true,
        });
      } else {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'DOWNTIME_UPDATE',
        }, {
          root: true,
        });
      }
    },
  },
  getters: {
    machineList: ({ machines }) => {
      let machineList = [];
      if (machines && machines.length) {
        machineList = machines
          .map((mac) => mac.machinename)
          .sort(sortAlphaNum);
        machineList = ['All Machines', ...machineList];
      }
      return machineList;
    },

    shiftList: ({ shifts }) => {
      let shiftList = [];
      if (shifts && shifts.length) {
        shiftList = ['All Shifts', ...shifts];
      }
      return shiftList;
    },

    downtime: ({ downtimeList }, getters, rootState, rootGetters) => {
      let downtime = null;
      if (downtimeList && downtimeList.length) {
        downtime = rootGetters['webApp/filteredRecords'](downtimeList);
        downtime = rootGetters['webApp/sortedRecords'](downtime);
        downtime = rootGetters['webApp/groupedRecords'](downtime);
      }
      if (!downtime || !Object.keys(downtime).length) {
        downtime = null;
      }
      return downtime;
    },
  },
});
