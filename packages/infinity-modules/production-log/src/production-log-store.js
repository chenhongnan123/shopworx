import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    isRejectionSet: false,
    onboarded: false,
    notStartedPlans: null,
    plansOnDate: null,
    machines: [],
    allShifts: [],
    shiftList: [],
    selectedMachine: null,
    selectedCell: null,
    selectedShift: null,
    selectedDate: null,
    planningMaster: null,
    rejectionReasonsMaster: null,
    rejectionMaster: null,
    masterData: [],
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setIsRejectionSet: set('isRejectionSet'),
    setNotStartedPlans: set('notStartedPlans'),
    setPlansOnDate: set('plansOnDate'),
    setMachines: set('machines'),
    setShift: set('allShifts'),
    setShiftList: set('shiftList'),
    setSelectedCell: set('selectedCell'),
    setSelectedMachine: set('selectedMachine'),
    setSelectedShift: set('selectedShift'),
    setSelectedDate: set('selectedDate'),
    setPlanningMaster: set('planningMaster'),
    setRejectionReasonsMaster: set('rejectionReasonsMaster'),
    setRejectionMaster: set('rejectionMaster'),
    setMasterData: set('masterData'),
  },
  actions: {
    getOnboardingState: async ({ commit, dispatch }) => {
      const rejectionElement = await dispatch('getRejectionElement');
      if (rejectionElement) {
        commit('setIsRejectionSet', true);
        const rejectionReasonElement = await dispatch('getRejectionReasonElement');
        if (rejectionReasonElement) {
          commit('setOnboarded', true);
        }
      }
    },

    getPlanningElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'planning',
        { root: true },
      );
      return !!element;
    },

    getRejectionReasonElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'rejectionreasons',
        { root: true },
      );
      return !!element;
    },
    getRejectionElement: async ({ dispatch }) => {
      const element = await dispatch(
        'element/getElement',
        'rejection',
        { root: true },
      );
      return !!element;
    },
    getMasterData: async ({ commit, dispatch, rootGetters }) => {
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
          .filter((elem) => (
            elem.masterElement.onboardingRequired
          ))
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
    // createRejectionReasonsElement: async ({ dispatch, state }) => {
    //   const { rejectionReasonsMaster } = state;
    //   if (rejectionReasonsMaster) {
    //     const element = rejectionReasonsMaster.masterElement;
    //     const tags = [...rejectionReasonsMaster.masterTags];
    //     const payload = {
    //       element,
    //       tags,
    //     };
    //     const success = await dispatch(
    //       'element/createElementAndTags',
    //       payload,
    //       { root: true },
    //     );
    //     return success;
    //   }
    //   return false;
    // },
    // createRejectionElement: async ({ dispatch, state }) => {
    //   const { rejectionMaster } = state;
    //   if (rejectionMaster) {
    //     const element = rejectionMaster.masterElement;
    //     const tags = [...rejectionMaster.masterTags];
    //     const payload = {
    //       element,
    //       tags,
    //     };
    //     const success = await dispatch(
    //       'element/createElementAndTags',
    //       payload,
    //       { root: true },
    //     );
    //     return success;
    //   }
    //   return false;
    // },
    getMasterElements: async ({ commit, dispatch, rootState }) => {
      const { id } = rootState.user.me.industry;
      const masterElements = await dispatch(
        'industry/getMasterElements',
        id,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        let planningMaster = null;
        let rejectionReasonsMaster = [];
        let rejectionMaster = [];
        masterElements
          .forEach((elem) => {
            if (elem.masterElement.elementName === 'planning') {
              planningMaster = elem;
            }
            if (elem.masterElement.elementName === 'rejectionreasons') {
              rejectionReasonsMaster = elem;
            }
            if (elem.masterElement.elementName === 'rejection') {
              rejectionMaster = elem;
            }
            return elem;
          });
        commit('setPlanningMaster', planningMaster);
        commit('setRejectionReasonsMaster', rejectionReasonsMaster);
        commit('setRejectionMaster', rejectionMaster);
        return true;
      }
      return false;
    },
    createRejectionElement: async ({ dispatch, state }) => {
      debugger;
      const { planningMaster, rejectionReasonsMaster, rejectionMaster } = state;
      if (planningMaster != null && rejectionReasonsMaster != null && rejectionMaster != null) {
        debugger;
        const element = rejectionMaster.masterElement;
        const tags = [
          ...rejectionReasonsMaster.masterTags,
          ...planningMaster.masterTags,
          ...rejectionMaster.masterTags,
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
    fetchBusinessHours: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'businesshours', query: '?sortquery=sortindex==1' },
        { root: true },
      );
      if (records) {
        if (records.length) {
          const allShifts = records.filter((rec) => rec.type === 'shift');
          commit('setShift', allShifts);
          const shiftList = [...new Set(allShifts.map((item) => item.name))];
          commit('setShiftList', shiftList);
          return true;
        }
      }
      return false;
    },

    fetchMachines: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'machine' },
        { root: true },
      );
      if (records) {
        commit('setMachines', records);
        return true;
      }
      return false;
    },

    getRejections: async ({ commit, dispatch }) => {
      // const { selectedShift, selectedMachine, allShifts } = state;
      // TODO get start and end date (shift/day)
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'rejection',
          // query: `&query=datefrom==${}&dateto==${}`,
        },
        { root: true },
      );
      if (records) {
        commit('setRejections', records);
        return true;
      }
      return false;
    },
    addRejection: async ({ dispatch }, rejectionData) => {
      const records = await dispatch(
        'element/postRecord', {
          elementName: 'rejection',
          payload: rejectionData,
        }, {
          root: true,
        },
      );
      if (records) {
        //  TODO  - Success toast - append data to rejectionDetails(Display)
        return true;
      }
      return false;
    },
    updateRejection: async ({ dispatch }, rejectionData) => {
      const { id } = rejectionData;
      const records = await dispatch(
        'element/updateRecordById', {
          elementName: 'rejection',
          id,
          payload: rejectionData,
        }, {
          root: true,
        },
      );
      if (records) {
        //  TODO  - Success toast
        return true;
      }
      return false;
    },
    getProductionReport: async ({ state, commit, dispatch }) => {
      const { selectedMachine, selectedShift } = state;
      // TODO get report start and end date (shift/day)
      // const reportDate =
      const records = await dispatch(
        'report/executeReport', {
          reportName: 'productionbyshift',
          payload: {
            machineVal: selectedMachine,
            shiftVal: selectedShift,
            // startDate: starDate,
            // endDate: endDate
          },
        }, {
          root: true,
        },
      );
      if (records) {
        commit('setRejections', records);
        return true;
      }
      return false;
    },

    getPlansBetweenDateRange: async ({ commit, dispatch }, { min, max }) => {
      const plans = await dispatch(
        'planning/getPlanningRecords',
        `?query=(actualstart<${max}%26%26actualend>${min})%7C%7C((status=="inProgress"%7C%7Cstatus=="paused")%26%26actualstart<${max})%7C%7C(status=="notStarted"%26%26scheduledstart<${max})`,
        { root: true },
      );
      commit('setPlansOnDate', plans);
    },

    getNotStartedPlans: async ({ commit, dispatch }) => {
      const plans = await dispatch(
        'planning/getPlanningRecords',
        '?query=status=="notStarted"',
        { root: true },
      );
      commit('setNotStartedPlans', plans);
    },
  },
  getters: {
    cells: ({ machines }) => {
      let cells = [];
      if (machines && machines.length) {
        cells = [...new Set(machines.map((m) => (m.machinecell)))];
        cells = cells.map((cell) => ({
          name: cell,
          value: cell,
        }));
        cells = [{ name: 'All cells', value: null }, ...cells];
      }
      return cells;
    },
    machineList: ({ machines }) => {
      let machineList = [];
      if (machines && machines.length) {
        machineList = machines.map((mac) => mac.machinename);
        machineList = ['All Machines', ...machineList];
      }
      return machineList;
    },
    shifts: ({ shiftList }) => {
      let shifts = [];
      if (shiftList && shiftList.length) {
        shifts = ['All Shift', ...shiftList];
      }
      return shifts;
    },
    filteredMachines: ({ machines, selectedCell }) => {
      let filteredMachines = machines;
      if (selectedCell && selectedCell.value && machines && machines.length) {
        filteredMachines = machines.filter((m) => m.machinecell === selectedCell.value);
      }
      return filteredMachines;
    },
  },
});
