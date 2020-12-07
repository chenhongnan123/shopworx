import {
  set, toggle, reactiveSetArray, reactiveRemoveArray,
} from '@shopworx/services/util/store.helper';
import { sortAlphaNum, sortArray } from '@shopworx/services/util/sort.service';
import HourService from '@shopworx/services/api/hour.service';

export default ({
  namespaced: true,
  state: {
    partMatrixElement: null,
    unavailableAssets: [],
    planningMaster: null,
    partMatrixMaster: [],
    calendarRef: null,
    calendarFocus: '',
    today: new Date().toISOString().substr(0, 10),
    masterData: [],
    drawer: false,
    onboarded: true,
    view: 'default',
    assets: [],
    machines: [],
    parts: [],
    shifts: [],
    planningList: [],
    reorderPlanList: [],
    loading: false,
    error: false,
    planningCount: 0,
    toggleSelection: false,
    lastRefreshedAt: null,
    lastRefreshedReorder: null,
    selectedPlan: [],
  },
  mutations: {
    setPartMatrixElement: set('partMatrixElement'),
    setUnavailableAssets: set('unavailableAssets'),
    setPlanningMaster: set('planningMaster'),
    setPartMatrixMaster: set('partMatrixMaster'),
    setCalendarRef: set('calendarRef'),
    setCalendarFocus: set('calendarFocus'),
    setMasterData: set('masterData'),
    setToggleSelection: set('toggleSelection'),
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setOnboarded: set('onboarded'),
    setView: set('view'),
    setAssets: set('assets'),
    setMachines: set('machines'),
    setParts: set('parts'),
    setShifts: set('shifts'),
    setLoading: set('loading'),
    setError: set('error'),
    setPlanningCount: set('planningCount'),
    setPlanningList: set('planningList'),
    setPlan: reactiveSetArray('planningList'),
    setNotStartedPlan: reactiveSetArray('reorderPlanList'),
    setPlanView: reactiveSetArray('selectedPlan'),
    removePlan: reactiveRemoveArray('planningList'),
    removeNotStartedPlan: reactiveRemoveArray('reorderPlanList'),
    setReorderPlanList: set('reorderPlanList'),
    setLastRefreshedAt: set('lastRefreshedAt'),
    setLastRefreshedReorder: set('lastRefreshedReorder'),
    setSelectedPlan: set('selectedPlan'),
  },
  actions: {
    getOnboardingState: async ({ commit, dispatch, rootGetters }) => {
      const partMatrix = await dispatch('getPartMatrixElement');
      if (partMatrix) {
        const licensedAssets = rootGetters['user/licensedAssets'];
        const sortedLicense = licensedAssets.sort().toString();
        const { tags: matrixTags } = partMatrix;
        const matrixAssets = matrixTags.map((t) => t.assetId);
        const uniqueMatrixAssets = [...new Set(matrixAssets)];
        const sortedMatrixAssets = uniqueMatrixAssets.sort().toString();
        if (sortedLicense !== sortedMatrixAssets) {
          commit('setOnboarded', false);
          commit('setUnavailableAssets', licensedAssets
            .filter((a) => !uniqueMatrixAssets.includes(a)));
        } else {
          const planning = await dispatch('getPlanningElement');
          if (planning) {
            const { tags } = planning;
            const assets = tags.map((tag) => tag.assetId);
            const uniqueAssets = [...new Set(assets)];
            const sortedAssets = uniqueAssets.sort().toString();
            if (sortedLicense === sortedAssets) {
              commit('setOnboarded', true);
            } else {
              await dispatch('createPlanningElement');
            }
          } else {
            await dispatch('createPlanningElement');
          }
        }
      } else {
        commit('setOnboarded', false);
      }
    },

    getPlanningElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'planning',
        { root: true },
      );
      return element;
    },

    getPartMatrixElement: async ({ commit, dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'partmatrix',
        { root: true },
      );
      commit('setPartMatrixElement', element);
      return element;
    },

    getPlanningMaster: async ({ commit, dispatch }) => {
      const masterElements = await dispatch(
        'industry/getMasterElements',
        null,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        const planningMaster = masterElements
          .find((elem) => elem.masterElement.elementName === 'planning');
        commit('setPlanningMaster', planningMaster);
        return true;
      }
      return false;
    },

    createPlanningElement: async ({ dispatch, state }) => {
      await Promise.all([
        dispatch('getPlanningMaster'),
        dispatch('getPartMatrixElement'),
      ]);
      const { planningMaster, partMatrixElement } = state;

      if (partMatrixElement) {
        const element = planningMaster.masterElement;
        const tags = [
          ...partMatrixElement.tags.filter((tag) => !tag.hide),
          ...planningMaster.masterTags,
        ];
        const payload = {
          element,
          tags,
        };
        const success = await dispatch(
          'element/createElementAndTags',
          payload,
          { root: true },
        );
        return success;
      }
      return false;
    },

    getPartMatrixMaster: async ({
      commit,
      dispatch,
      getters,
      state,
    }, { generateData = false }) => {
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
        const planningMaster = masterElements
          .find((elem) => elem.masterElement.elementName === 'planning');
        commit('setPlanningMaster', planningMaster);
        const { unavailableAssets } = state;
        const matrixMasterElement = masterElements
          .find((elem) => elem.masterElement.elementName === 'partmatrix');
        let assets = [...unavailableAssets];
        if (unavailableAssets.length === 0) {
          const availableAssets = matrixMasterElement.masterTags.map((tag) => tag.assetId);
          const provisionedAssets = [...new Set(availableAssets)];
          assets = [...provisionedAssets];
        }
        const filteredMasterElements = assets.map(async (provisionedAsset) => {
          const tags = matrixMasterElement.masterTags
            .filter((tag) => tag.assetId === provisionedAsset);
          const { assetName, assetDescription } = masterAssets
            .find((asset) => asset.id === provisionedAsset);
          const partMatrixElements = getters.partMatrixComposition(provisionedAsset);
          const partMatrix = partMatrixElements.map((element) => {
            const e = masterElements
              .find((master) => master.masterElement.elementName === element);
            const tag = e.masterTags
              .filter((t) => t.assetId === provisionedAsset)
              .find((t) => t.tagName === e.masterElement.uniqueTagName);
            return {
              tag,
              element: e.masterElement.elementName,
              tagName: tag.tagName,
              tagDescription: tag.tagDescription,
            };
          });
          let data = [];
          if (generateData) {
            data = await dispatch('generateMatrix', {
              matrixMaster: partMatrix,
              assetId: provisionedAsset,
            });
          }
          return {
            tags: [...partMatrix.map((t) => t.tag), ...tags.filter((t) => !t.hide)],
            hiddenTags: tags.filter((t) => t.hide),
            success: false,
            loading: false,
            data,
            assetId: provisionedAsset,
            element: matrixMasterElement.masterElement,
            title: `${matrixMasterElement.masterElement.elementDescription} - ${assetDescription}`,
            expectedFileName: `${matrixMasterElement.masterElement.elementName}-${assetName}.csv`,
          };
        });
        commit('setPartMatrixMaster', await Promise.all(filteredMasterElements));
        return true;
      }
      return false;
    },

    generateMatrix: async ({ dispatch }, { matrixMaster, assetId }) => {
      let result = [];
      if (matrixMaster && matrixMaster.length) {
        const getAllRecords = matrixMaster
          .map(async (master) => {
            const { element, tagName, tagDescription } = master;
            const data = await dispatch(
              'element/getRecords',
              {
                elementName: element,
                query: `?query=assetid==${assetId}`,
              },
              { root: true },
            );
            return data.map((d) => ({
              [tagDescription]: d[tagName],
            }));
          });
        const records = await Promise.all(getAllRecords);
        result = records.reduce((acc, cur) => acc
          .flatMap((x) => cur.map((y) => ({ ...x, ...y }))), [[]]);
      }
      return result;
    },

    fetchAssets: async ({ commit, dispatch }) => {
      const assets = await dispatch(
        'industry/getAssets',
        null,
        { root: true },
      );
      if (assets && assets.length) {
        commit('setAssets', assets);
        return true;
      }
      return false;
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

    fetchParts: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'part',
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setParts', records);
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
        commit('setShifts', records);
        return true;
      }
      return false;
    },

    fetchPlanningList: async ({
      commit, dispatch, getters, rootGetters,
    }) => {
      const filters = rootGetters['webApp/filters'];
      let [min, max] = filters.date.value;
      [min, max] = getters.getDateRange([min, max]);
      commit('setLoading', true);
      commit('setPlanningList', []);
      commit('setError', false);
      const completedOrAbortedPlans = `(actualstart<${max}%26%26actualend>${min})`;
      const inProgressPlans = `(status=="inProgress"%26%26actualstart<${max})`;
      const newPlans = `(status=="notStarted"%26%26scheduledstart>${min}%26%26scheduledend<${max})`;
      const or = '%7C%7C';
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'planning',
          query: `?query=${completedOrAbortedPlans}${or}${inProgressPlans}${or}${newPlans}`,
        },
        { root: true },
      );
      if (data && data.results) {
        const plans = data.results.map((plan) => {
          const equipmentname = plan.moldname || plan.toolname;
          return {
            ...plan,
            equipmentname,
          };
        });
        commit('setPlanningList', plans);
        commit('setPlanningCount', data.totalCount);
        commit('setError', false);
        commit('setLastRefreshedAt', new Date().toLocaleTimeString('en-GB'));
      } else {
        commit('setPlanningList', []);
        commit('setPlanningCount', 0);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    fetchReorderPlanList: async ({ commit, dispatch }) => {
      commit('setLoading', true);
      commit('setReorderPlanList', []);
      commit('setError', false);
      const data = await dispatch(
        'element/getRecordsWithCount',
        {
          elementName: 'planning',
          query: '?query=status=="notStarted"&sortquery=sortindex==1',
        },
        { root: true },
      );
      if (data && data.results) {
        const plans = data.results.map((plan) => {
          const equipmentname = plan.moldname || plan.toolname;
          return {
            ...plan,
            equipmentname,
          };
        });
        commit('setReorderPlanList', plans);
        commit('setError', false);
        commit('setLastRefreshedReorder', new Date().toLocaleTimeString('en-GB'));
      } else {
        commit('setReorderPlanList', []);
        commit('setError', true);
      }
      commit('setLoading', false);
    },

    fetchPartMatrix: async ({ dispatch }, { partname }) => {
      const payload = {
        elementName: 'partmatrix',
        query: `?query=partname=="${encodeURIComponent(partname)}"`,
      };
      const partMatrixRecords = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (partMatrixRecords && partMatrixRecords.length) {
        return partMatrixRecords.map((matrix) => ({
          ...matrix,
          equipmentname: matrix.moldname || matrix.toolname,
        }));
      }
      return [];
    },

    isFamilyMold: async ({ dispatch }, query) => {
      const payload = {
        elementName: 'mold',
        query,
      };
      const molds = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (molds && molds.length === 1) {
        return molds[0].isfamilymold;
      }
      return false;
    },

    getFamilyParts: async ({ dispatch }, query) => {
      const payload = {
        elementName: 'partmatrix',
        query,
      };
      const partMatrixRecords = await dispatch(
        'element/getRecords',
        payload,
        { root: true },
      );
      if (partMatrixRecords && partMatrixRecords.length) {
        return partMatrixRecords;
      }
      return [];
    },

    getScheduledEnd: async (_, { start, duration }) => {
      const { data } = await HourService.getPlanEndTime(start, duration);
      if (data && data.results) {
        return data.results;
      }
      return start + duration;
    },

    fetchLastPlan: async ({ dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'planning',
          query: '?sortquery=sortindex==-1&pagenumber=1&pagesize=1',
        },
        { root: true },
      );
      if (records && records.length === 1) {
        return records[0];
      }
      return null;
    },

    fetchPlan: async ({ commit, dispatch }, planId) => {
      commit('setSelectedPlan', []);
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'planning',
          query: `?query=planid=="${planId}"`,
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setSelectedPlan', records);
        return true;
      }
      commit('setSelectedPlan', []);
      return false;
    },

    createPlans: async ({ dispatch }, payload) => {
      const created = await dispatch(
        'element/postBulkRecords',
        {
          elementName: 'planning',
          payload,
        },
        { root: true },
      );
      return created;
    },

    updatePlanByPlanId: async ({
      state,
      commit,
      dispatch,
    }, { planId, payload, listType }) => {
      const updated = await dispatch(
        'element/updateRecordByQuery',
        {
          elementName: 'planning',
          queryParam: `?query=planid=="${planId}"`,
          payload,
        },
        { root: true },
      );
      if (listType === 'reorder') {
        const { reorderPlanList } = state;
        for (let i = 0; i < reorderPlanList.length; i += 1) {
          if (reorderPlanList[i].planid === planId) {
            commit('setNotStartedPlan', {
              index: i,
              payload: {
                ...reorderPlanList[i],
                ...payload,
              },
            });
          }
        }
      } else if (listType === 'all') {
        const { planningList } = state;
        for (let i = 0; i < planningList.length; i += 1) {
          if (planningList[i].planid === planId) {
            commit('setPlan', {
              index: i,
              payload: {
                ...planningList[i],
                ...payload,
              },
            });
          }
        }
      } else {
        const { selectedPlan } = state;
        for (let i = 0; i < selectedPlan.length; i += 1) {
          if (selectedPlan[i].planid === planId) {
            commit('setPlanView', {
              index: i,
              payload: {
                ...selectedPlan[i],
                ...payload,
              },
            });
          }
        }
      }
      if (updated) {
        commit('helper/setAlert', {
          show: true,
          type: 'success',
          message: 'PLAN_UPDATED',
        }, {
          root: true,
        });
      } else {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'PLAN_UPDATED',
        }, {
          root: true,
        });
      }
    },

    deletePlanByPlanId: async ({
      state,
      commit,
      dispatch,
    }, { planId, listType }) => {
      const deleted = await dispatch(
        'element/deleteRecordByQuery',
        {
          elementName: 'planning',
          queryParam: `?query=planid=="${planId}"`,
        },
        { root: true },
      );
      if (listType === 'reorder') {
        const { reorderPlanList } = state;
        for (let i = 0; i < reorderPlanList.length; i += 1) {
          if (reorderPlanList[i].planid === planId) {
            commit('removeNotStartedPlan', {
              index: i,
            });
          }
        }
      } else if (listType === 'all') {
        const { planningList } = state;
        for (let i = 0; i < planningList.length; i += 1) {
          if (planningList[i].planid === planId) {
            commit('removePlan', {
              index: i,
            });
          }
        }
      }
      if (deleted) {
        commit('helper/setAlert', {
          show: true,
          type: 'success',
          message: 'PLAN_DELETED',
        }, {
          root: true,
        });
      } else {
        commit('helper/setAlert', {
          show: true,
          type: 'error',
          message: 'PLAN_DELETED',
        }, {
          root: true,
        });
      }
      return deleted;
    },

    updatePlanById: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'planning',
          id,
          payload,
        },
        { root: true },
      );
      return updated;
    },

    deletePlanById: async ({ dispatch }, id) => {
      const deleted = await dispatch(
        'element/deleteRecordById',
        {
          elementName: 'planning',
          id,
        },
        { root: true },
      );
      return deleted;
    },

    updateMachine: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'machine',
          id,
          payload,
        },
        { root: true },
      );
      return updated;
    },

    updatePartMatrix: async ({ dispatch }, { id, payload }) => {
      const updated = await dispatch(
        'element/updateRecordById',
        {
          elementName: 'partmatrix',
          id,
          payload,
        },
        { root: true },
      );
      return updated;
    },
  },
  getters: {
    planningSchema: (_, __, rootState, rootGetters) => {
      const { appSchema } = rootState.webApp;
      const licensedAssets = rootGetters['user/licensedAssets'];
      if (appSchema) {
        return appSchema.filter((schema) => licensedAssets.includes(schema.assetId));
      }
      return [];
    },

    partMatrixComposition: (_, { planningSchema }) => (assetId) => {
      if (planningSchema && planningSchema.length) {
        return planningSchema
          .find((schema) => schema.assetId === assetId)
          .partMatrixComposition;
      }
      return [];
    },

    isCalendarView: ({ view }) => view !== 'default',

    selectedAsset: ({ assets }) => (assetId) => {
      let asset = null;
      if (assets && assets.length && assetId) {
        asset = assets.find((a) => a.id === assetId);
        if (asset) {
          asset = asset.assetName;
        }
      }
      return asset;
    },

    partMatrixTags: ({ partMatrixElement }) => (assetId) => {
      let tags = [];
      if (partMatrixElement && assetId) {
        tags = partMatrixElement.tags.filter((tag) => tag.assetId === assetId && !tag.hide);
      }
      return tags;
    },

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

    partList: ({ parts }) => {
      let partList = [];
      if (parts && parts.length) {
        partList = parts
          .map((mac) => mac.partname)
          .sort(sortAlphaNum);
        partList = ['All Parts', ...partList];
      }
      return partList;
    },

    planStatus: () => (status) => {
      let result = { text: 'New', color: 'info' };
      if (status === 'inProgress') {
        result = { text: 'Operational', color: 'success' };
      } else if (status === 'complete') {
        result = { text: 'Complete', color: 'accent' };
      } else if (status === 'abort') {
        result = { text: 'Aborted', color: 'error' };
      }
      return result;
    },

    getDateRange: ({ shifts }) => ([start, end]) => {
      const [shift] = shifts.sort((a, b) => a.sortindex - b.sortindex);
      const [hr, min] = shift.starttime.split(':');
      const [sYear, sMonth, sDay] = start.split('-');
      const [eYear, eMonth, eDay] = end.split('-');
      const oneDayInMs = 86400000;
      return [
        new Date(
          sYear,
          sMonth - 1,
          sDay,
          parseInt(hr, 10),
          parseInt(min, 10),
          0,
        ).getTime(),
        new Date(
          eYear,
          eMonth - 1,
          eDay,
          parseInt(hr, 10),
          parseInt(min, 10),
          0,
        ).getTime() + oneDayInMs,
      ];
    },

    planning: (
      { planningList },
      { isCalendarView },
      rootState,
      rootGetters,
    ) => {
      let planning = null;
      if (planningList && planningList.length) {
        const [group] = rootGetters['webApp/group'];
        planning = rootGetters['webApp/filteredRecords'](planningList);
        if (!isCalendarView) {
          planning = rootGetters['webApp/sortedRecords'](planning);
          planning = sortArray(planning, group);
          planning = rootGetters['webApp/groupedRecords'](planning);
        }
      }
      if (!planning || !Object.keys(planning).length) {
        planning = null;
      }
      return planning;
    },

    notStartedPlans: ({ reorderPlanList }) => {
      let planning = null;
      if (reorderPlanList && reorderPlanList.length) {
        planning = sortArray(reorderPlanList, 'machinename');
        planning = planning.sort((a, b) => a.sortindex - b.sortindex);
        planning = planning.reduce((result, currentValue) => {
          const key = currentValue.machinename;
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
      }
      if (!planning || !Object.keys(planning).length) {
        planning = null;
      }
      return planning;
    },
  },
});
