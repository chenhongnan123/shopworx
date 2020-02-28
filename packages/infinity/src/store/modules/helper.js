import { set, toggle } from '@shopworx/services/util/store.service';

export default ({
  state: {
    drawer: true,
    insightsDrawer: false,
    isDark: null,
  },
  mutations: {
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    setInsightsDrawer: set('insightsDrawer'),
    toggleInsightsDrawer: toggle('insightsDrawer'),
    setIsDark: set('isDark'),
    toggleIsDark: toggle('isDark'),
  },
});
