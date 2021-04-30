import { set } from '@shopworx/services/util/store.helper';
import ApiService from '@shopworx/services/api/api.service';

export default ({
  namespaced: true,
  state: {
    loading: false,
    currentDate: null,
    shifts: [],
    reportdata: null,
    reportdata258: null,
    reportdata259: null,
  },
  mutations: {
    setLoading: set('loading'),
    setShifts: set('shifts'),
    setReportData: set('reportdata'),
    setReportData258: set('reportdata258'),
    setReportData259: set('reportdata259'),
  },
  actions: {
    getShifts: async ({ commit, dispatch }) => {
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
        return records;
      }
      return false;
    },
    getReportData: async ({ dispatch, commit }) => {
      const shifts = await dispatch('getShifts');
      const [shift] = shifts;
      const currentday = new Date().getDate();
      const currenthour = new Date().getHours();
      const date = currenthour < shift.starttime ? currentday - 1 : currentday;
      const startdate = new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${date} ${shift.starttime}`).getTime();
      const enddate = Date.now();
      const payload = {
        startdate,
        enddate,
      };
      console.log(payload, 'payload');
      let reportData = await dispatch(
        'report/executeReport',
        {
          reportName: 'dashboardreport',
          payload,
        },
        { root: true },
      );
      reportData = JSON.parse(reportData);
      console.log(reportData, 'reportData');
      const { tlabel } = reportData.reportdatacols[0];
      commit('setReportData', reportData);
      await dispatch('getReportData258', { startdate, enddate, tlabel });
      await dispatch('getReportData259', { startdate, enddate, tlabel });
    },
    getReportData258: async ({ dispatch, commit }, payload) => {
      const { startdate, enddate, tlabel } = payload;
      const records = await dispatch(
        'element/getRecordsByTags',
        {
          elementName: 'process_substation-258',
          queryParam: `?datefrom=${startdate}&&dateto=${enddate}&&pagenumber=1&&pagesize=2000&&query=mainid=="${tlabel}"`,
          payload: {
            tags: [
              'mainid',
              'timestamp',
              'op105mobpidact',
              'op105mobtempact1',
              'op106mobpidact',
              'op106mobtempact1',
            ],
          },
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setReportData258', records.reverse());
        return records;
      }
      return false;
    },
    getReportData259: async ({ dispatch, commit }, payload) => {
      const { startdate, enddate, tlabel } = payload;
      const records = await dispatch(
        'element/getRecordsByTags',
        {
          elementName: 'process_substation-259',
          queryParam: `?datefrom=${startdate}&&dateto=${enddate}&&pagenumber=1&&pagesize=2000&&query=mainid=="${tlabel}"`,
          payload: {
            tags: [
              'mainid',
              'timestamp',
              'op201fixpidact',
              'op201fixtempact1',
              'op201mobpidact',
              'op201mobtempact1',
              'op202fixpidact',
              'op202fixtempact1',
              'op202mobpidact',
              'op202mobtempact1',
              'op203mobpidact',
              'op203mobtempact1',
              'op204mobpidact',
              'op204mobtempact1',
            ],
          },
        },
        { root: true },
      );
      if (records && records.length) {
        commit('setReportData259', records.reverse());
        return records;
      }
      return false;
    },
    getReportDataDev: async ({ commit, dispatch }) => {
      console.log(ApiService, 'ApiService');
      const { data } = await ApiService.get('./copy2.json');
      const { reportData } = data;
      console.log(JSON.parse(reportData), 'reportData');
      commit('setReportData', JSON.parse(reportData));
      dispatch('getReportData258Dev');
      dispatch('getReportData259Dev');
    },
    getReportData258Dev: async ({ commit }) => {
      const { data } = await ApiService.get('./258result.json');
      const { results } = data;
      console.log(results, 'results258');
      commit('setReportData258', results.reverse());
    },
    getReportData259Dev: async ({ commit }) => {
      const { data } = await ApiService.get('./259result.json');
      const { results } = data;
      console.log(results, 'results259');
      commit('setReportData259', results.reverse());
    },
  },
  getters: {
    getRandomNumber: () => ({ min, max }) => Math
      .floor(Math.random() * (max * 100 - min * 100) + min * 100) / (min * 100),
  },
});
