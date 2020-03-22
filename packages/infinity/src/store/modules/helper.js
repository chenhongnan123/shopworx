import { set, toggle } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    alert: {
      show: false,
      type: null,
      message: null,
    },
    drawer: true,
    isDark: null,
    insightsDrawer: false,
  },
  mutations: {
    setAlert: set('alert'),
    setDrawer: set('drawer'),
    setIsDark: set('isDark'),
    toggleDrawer: toggle('drawer'),
    toggleIsDark: toggle('isDark'),
    setInsightsDrawer: set('insightsDrawer'),
    toggleInsightsDrawer: toggle('insightsDrawer'),
  },
});
