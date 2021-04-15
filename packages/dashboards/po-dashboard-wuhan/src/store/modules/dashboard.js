import { set } from '../../utils/helper';
import reportService from '@/service/reportsService';

export default {
  state: {
    startdate: null,
    enddate: null,
    dashboardData: null,
    chartsDataF2: null,
    chartsDataF3: null,
  },
  mutations: {
    SET_STARTDATE: set('startdate'),
    SET_ENDDATE: set('enddate'),
    SET_DASHBOARDDATA: set('dashboardData'),
    SET_CHARTSDATAF2: set('chartsDataF2'),
    SET_CHARTSDATAF3: set('chartsDataF3'),
  },
  actions: {
    GET_SESSION_ID:async ({ dispatch }) => {
      const { data } = await reportService.postServe(
        'authenticate',
        1,
        1,
        '',
        {'identifier': "918928509173", 'password': "entrib"},
        {headers:{'loginType': 'INFINITY'}}
      );
      const sessionId = data.sessionId;
      await dispatch('GET_DASHBOARDDATA', sessionId);
    },
    GET_DASHBOARDDATA:async ({ commit, dispatch }, sessionId) => {
      const shiftData = await reportService.getServe(
        'shiftfortimestamp',
        '1',
        '1',
            '',
            {headers:{'sessionid':sessionId}}
      );
      const serveData = await reportService.getServe(
        'servertime',
        '1',
        '1',
         '',
         {headers:{'sessionid':sessionId}}
      );
      const shiftResult = shiftData.data.results[0];
      const servertime = serveData.data.results;
      const startdate = shiftResult.starttimestamp;
      const enddate = servertime;
      commit('SET_STARTDATE', startdate);
      commit('SET_ENDDATE', enddate);
      
      const { data } = await reportService.getReport(
        'executereport',
        'dashboardreport',
        '1',
        '1',
        {
          "startdate": startdate,
          "enddate": enddate,
        },
        '&all=true',
        {headers:{'sessionid':sessionId}}
      );
      

      // const { data } = await reportService.getJson('./copy2.json');
      // console.log(data);
      const { reportData } = data;
      console.log(JSON.parse(reportData), 'data');
      commit('SET_DASHBOARDDATA', JSON.parse(reportData));
      const tlabel = JSON.parse(reportData).reportdatacols[0].tlabel;
      await dispatch('GET_CHARTSDATAF2',{startdate,enddate,tlabel,sessionId});
      await dispatch('GET_CHARTSDATAF3',{startdate,enddate,tlabel,sessionId});
      // await dispatch('GET_CHARTSDATAF2',{tlabel});
      // await dispatch('GET_CHARTSDATAF3',{tlabel});
    },
    GET_CHARTSDATAF2:async ({ commit },{startdate,enddate,tlabel,sessionId}) => {
      const { data } = await reportService.getElement(
        'fcprocessparam',
        '1',
        '1',
        `&&datefrom=${startdate}&&dateto=${enddate}&&timestamp==-1&&query=TLabel=="${tlabel}"%26%26machinename=="fcstation2"`,
         {headers:{'sessionid':sessionId}},
      );
      // const { data } = await reportService.getJson('./test1.json');
      const { results } = data;
      console.log(results, 'resultsF2');
      commit('SET_CHARTSDATAF2', results);
    },
    GET_CHARTSDATAF3:async ({ commit },{startdate,enddate,tlabel,sessionId}) => {
      const { data } = await reportService.getElement(
        'fcprocessparam',
        '1',
        '1',
        `&&datefrom=${startdate}&&dateto=${enddate}&&timestamp==-1&&query=TLabel=="${tlabel}"%26%26machinename=="fcstation3"`,
        {headers:{'sessionid':sessionId}},
      );
      // const { data } = await reportService.getJson('./test2.json');
      const { results } = data;
      console.log(results, 'resultsF3');
      commit('SET_CHARTSDATAF3', results);
    },
  },
};
