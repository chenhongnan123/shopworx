export default [
  {
    insightViewName: 'What were the top reasons for downtime in the last week?',
    inputMap: '{"siteId": true,"count": 5,"time":{"year": 0,"week": -1}}',
    reportName: 'topdowntimereasonsinaweek',
    categoryName: 'basicperformance',
    parentId: 0,
  }, {
    insightViewName: 'What were the total parts produced last week, machine wise?',
    inputMap: '{"siteId": true,"time":{"year": 0,"week": -1}}',
    reportName: 'weeklymachineproduction',
    categoryName: 'basicperformance',
    parentId: 0,
  }, {
    insightViewName: 'What is the summary of yesterday\'s production?',
    inputMap: '{"siteId": true,"time":{"date":-1}}',
    reportName: 'yesterdaysproductionsummary',
    categoryName: 'basicperformance',
    parentId: 0,
  }, {
    insightViewName: 'What were the top rejections, part wise, in the last month?',
    inputMap: '{"siteId": true,"time":{"year": 0,"month": -1}}',
    reportName: 'monthlypartrejection',
    categoryName: 'basicperformance',
    parentId: 0,
  },
];
