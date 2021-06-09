export default [
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Machine Production',
      reportName: 'hourlymachineproduction',
      reportsCategoryName: 'production',
    },
    reportViewMapping: {
      reportNames: ['shiftwisemachineproduction', 'dailymachineproduction'],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Machine Downtime',
      reportName: 'hourlymachinedowntime',
      reportsCategoryName: 'downtime',
    },
    reportViewMapping: {
      reportNames: ['shiftwisemachinedowntime', 'dailymachinedowntime'],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Machine Performace',
      reportName: 'hourlymachineperformance',
      reportsCategoryName: 'performance',
    },
    reportViewMapping: {
      reportNames: ['shiftwisemachineperformance', 'dailymachineperformance'],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Shopfloor Analysis',
      reportName: 'hourlyanalysis',
      reportsCategoryName: 'performance',
    },
    reportViewMapping: {
      reportNames: [],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Operator Efficiency',
      reportName: 'shiftwiseoperatorefficiency',
      reportsCategoryName: 'performance',
    },
    reportViewMapping: {
      reportNames: [],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Rejection By Reason',
      reportName: 'hourlyrejectionbyreason',
      reportsCategoryName: 'quality',
    },
    reportViewMapping: {
      reportNames: ['shiftwiserejectionbyreason', 'dailyrejectionbyreason'],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Rework By Reason',
      reportName: 'shiftwisereworkbyreason',
      reportsCategoryName: 'quality',
    },
    reportViewMapping: {
      reportNames: ['dailyreworkbyreason'],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Scrap By Reason',
      reportName: 'shiftwisescrapbyreason',
      reportsCategoryName: 'quality',
    },
    reportViewMapping: {
      reportNames: ['dailyscrapbyreason'],
    },
  },
  {
    reportView: {
      gridObject: '',
      reportViewName: 'Energy Consumption',
      reportName: 'hourlyenergyconsumption',
      reportsCategoryName: 'utility',
    },
    reportViewMapping: {
      reportNames: ['shiftwiseenergyconsumption'],
    },
  },
];
