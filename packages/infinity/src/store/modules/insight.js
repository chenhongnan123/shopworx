import { set } from '@shopworx/services/util/store.helper';

export default ({
  state: {
    insightsOnDemand: [],
    query: null,
    window: 0,
  },
  mutations: {
    setInsightsOnDemand: set('insightsOnDemand'),
    setQuery: set('query'),
    setWindow: set('window'),
  },
});
