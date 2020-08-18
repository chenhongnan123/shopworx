import { set } from '@shopworx/services/util/store.helper';

export default ({
  namespaced: true,
  state: {
    isRejectionSet: false,
    onboarded: false,
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
    rejectionReasons: [],
    productionDetails: [],
    allRejections: null,
    businessHours: [],
  },
  mutations: {
    setOnboarded: set('onboarded'),
    setIsRejectionSet: set('isRejectionSet'),
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
    setRejectionReasons: set('rejectionReasons'),
    setProductionDetails: set('productionDetails'),
    setAllRejections: set('allRejections'),
    setBusinessHours: set('businessHours'),
  },
  actions: {
    getOnboardingState: async ({ commit, dispatch }) => {
      const rejectionElement = await dispatch('getElement', 'rejection');
      if (rejectionElement) {
        commit('setIsRejectionSet', true);
        const rejectionReasonElement = await dispatch('getElement', 'rejectionreasons');
        if (rejectionReasonElement) {
          commit('setOnboarded', true);
        }
      }
    },

    getElement: async ({ dispatch }, elementName) => {
      const element = await dispatch(
        'element/getElement',
        elementName,
        { root: true },
      );
      return element;
    },
    // TODO - below 2 functions can be merged
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
    getMasterElements: async ({ commit, dispatch, rootState }) => {
      const { id } = rootState.user.me.industry;
      const masterElements = await dispatch(
        'industry/getMasterElements',
        id,
        { root: true },
      );
      if (masterElements && masterElements.length) {
        const planningMaster = await dispatch('getElement', 'planning');
        const rejectionReasonsMaster = await dispatch('getElement', 'rejectionreasons');
        let rejectionMaster = [];
        masterElements
          .forEach((elem) => {
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
    createRejectionElement: async ({ dispatch, state, rootState }) => {
      const { planningMaster, rejectionReasonsMaster, rejectionMaster } = state;
      let { licenses } = rootState.user;
      licenses = licenses.map((l) => l.assetId);
      const assets = [...new Set(licenses)];
      const assetReasonMasters = [];
      assets.forEach((l) => {
        rejectionReasonsMaster.tags.forEach((rm) => {
          assetReasonMasters.push({ ...rm, assetId: l });
        });
      });
      if (planningMaster != null && rejectionReasonsMaster != null && rejectionMaster != null) {
        const element = rejectionMaster.masterElement;
        const tags = [
          ...rejectionMaster.masterTags,
          ...planningMaster.tags.filter((t) => !t.hide),
          ...assetReasonMasters,
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
          commit('setBusinessHours', records);
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
    fetchRejectionReasons: async ({ commit, dispatch }) => {
      const records = await dispatch(
        'element/getRecords',
        { elementName: 'rejectionreasons' },
        { root: true },
      );
      if (records) {
        commit('setRejectionReasons', records);
        return true;
      }
      return false;
    },

    getRejections: async ({ state, commit, dispatch }) => {
      const { selectedDate, selectedShift, selectedMachine } = state;
      const date = parseInt(selectedDate.replace(/-/g, ''), 10);
      let query = `?query=date==${date}`;
      // TODO - i18n check for "All"
      if (!selectedShift.includes('All')) {
        query = `${query}%26%26shift=="${selectedShift}"`;
      }
      if (!selectedMachine.includes('All')) {
        query = `${query}%26%26machinename=="${selectedMachine}"`;
      }
      const records = await dispatch(
        'element/getRecords',
        {
          elementName: 'rejection',
          query,
        },
        { root: true },
      );
      if (records) {
        commit('setAllRejections', records);
        return true;
      }
      return false;
    },
    addRejection: async ({ dispatch, commit, state }, rejectionData) => {
      const { allRejections } = state;
      const records = await dispatch(
        'element/postRecord', {
          elementName: 'rejection',
          payload: rejectionData,
        }, {
          root: true,
        },
      );
      if (records) {
        //  TODO  - Success toast
        rejectionData._id = records.id;
        allRejections.unshift(rejectionData);
        await dispatch('executeProductionReport');
        commit('setAllRejections', allRejections);
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
        await dispatch('executeProductionReport');
        await dispatch('getRejections');
        return true;
      }
      return false;
    },
    executeProductionReport: async ({
      state,
      commit,
      dispatch,
      rootGetters,
    }) => {
      const sites = rootGetters['user/sites'];
      const { selectedMachine, selectedShift, selectedDate } = state;
      let machineFilter = null;
      let shiftFilter = null;
      if (!selectedDate || !selectedMachine || !selectedShift) {
        return false;
      }
      // TODO - use common function
      if (selectedMachine.includes('All ')) {
        let machineList = rootGetters['productionLog/machineList'];
        machineList = machineList.filter((machine) => !machine.includes('All ')).join();
        machineFilter = `{${machineList}}`;
      } else {
        machineFilter = `{${selectedMachine}}`;
      }
      if (selectedShift.includes('All ')) {
        let shifts = rootGetters['productionLog/shifts'];
        shifts = shifts.filter((machine) => !machine.includes('All ')).join();
        shiftFilter = `{${shifts}}`;
      } else {
        shiftFilter = `{${selectedShift}}`;
      }
      const reportData = await dispatch(
        'report/executeReport', {
          reportName: 'productionlogreport',
          payload: {
            machineFilter,
            shiftFilter,
            start: parseInt(selectedDate.replace(/-/g, ''), 10),
            end: parseInt(selectedDate.replace(/-/g, ''), 10),
            siteid: sites[0].id,
          },
        },
        { root: true },
      );
      if (reportData) {
        try {
          await commit('setProductionDetails', JSON.parse(reportData).reportData);
          await dispatch('getRejections');
          return true;
        } catch (error) {
          console.error(`Exception while parsing production report data : ${error}`);
        }
      }
      return false;
    },
  },
  getters: {
    planProductionData: ({ productionDetails, allRejections }) => {
      const data = [];
      let res = null;
      if (productionDetails && productionDetails.length && allRejections) {
        productionDetails.forEach((plan) => {
          const rejection = allRejections.filter(
            (rej) => rej.planid === plan.planid
            && rej.partname === plan.partname
            && rej.shiftName === plan.shift,
          );
          data.push({
            ...plan,
            rejectionDetails: rejection,
          });
        });
        res = data.reduce((acc, curr) => {
          if (curr.firstcycle && curr.firstcycle !== '-') {
            curr.firstcycle = new Date(curr.firstcycle).toISOString().substr(11, 5);
          }
          if (curr.lastcycle && curr.lastcycle !== '-') {
            curr.lastcycle = new Date(curr.lastcycle).toISOString().substr(11, 5);
          }
          if (!acc[curr.machinename]) acc[curr.machinename] = [];
          acc[curr.machinename].push(curr);
          return acc;
        }, {});
      }
      console.log(res);
      return res;
    },
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
