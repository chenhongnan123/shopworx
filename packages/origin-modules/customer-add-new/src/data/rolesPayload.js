export default [{
  isComplete: false,
  isLoading: false,
  payload: {
    roleName: 'admin',
    roleDescription: 'Admin',
    roleType: 'ADMINISTRATOR',
  },
  modules: [{
    name: 'apps',
    enterpriseMode: false,
    items: ['home', 'productionPlanning', 'productionLog', 'downtimeLog'],
  }, {
    name: 'dashboards',
    enterpriseMode: false,
    items: ['liveShopfloor'],
  }, {
    name: 'reports',
    enterpriseMode: false,
    items: ['production', 'downtime', 'quality', 'performance'],
  }, {
    name: 'masters',
    enterpriseMode: false,
  }, {
    name: 'admin',
    enterpriseMode: false,
  }, {
    name: 'insights',
    enterpriseMode: false,
  }],
}, {
  isComplete: false,
  isLoading: false,
  payload: {
    roleName: 'planthead',
    roleDescription: 'Plant head',
    roleType: 'ADMINISTRATOR',
  },
  modules: [{
    name: 'apps',
    enterpriseMode: false,
    items: ['home', 'productionPlanning', 'productionLog', 'downtimeLog'],
  }, {
    name: 'dashboards',
    enterpriseMode: false,
    items: ['liveShopfloor'],
  }, {
    name: 'reports',
    enterpriseMode: false,
    items: ['production', 'downtime', 'quality', 'performance'],
  }, {
    name: 'masters',
    enterpriseMode: false,
  }, {
    name: 'admin',
    enterpriseMode: false,
  }, {
    name: 'insights',
    enterpriseMode: false,
  }],
}, {
  isComplete: false,
  isLoading: false,
  payload: {
    roleName: 'planner',
    roleDescription: 'Production planner',
    roleType: 'USER',
  },
  modules: [{
    name: 'apps',
    enterpriseMode: false,
    items: ['home', 'productionPlanning'],
  }, {
    name: 'reports',
    enterpriseMode: false,
    items: ['production', 'performance'],
  }, {
    name: 'masters',
    enterpriseMode: false,
  }, {
    name: 'insights',
    enterpriseMode: false,
  }],
}, {
  isComplete: false,
  isLoading: false,
  payload: {
    roleName: 'supervisor',
    roleDescription: 'Production supervisor',
    roleType: 'USER',
  },
  modules: [{
    name: 'apps',
    enterpriseMode: false,
    items: ['home', 'productionLog', 'downtimeLog'],
  }, {
    name: 'dashboards',
    enterpriseMode: false,
    items: ['liveShopfloor'],
  }, {
    name: 'reports',
    enterpriseMode: false,
    items: ['production', 'downtime', 'quality', 'performance'],
  }, {
    name: 'masters',
    enterpriseMode: false,
  }, {
    name: 'insights',
    enterpriseMode: false,
  }],
}];
