<template>
  <v-navigation-drawer
    app
    right
    clipped
    width="290"
    v-model="drawerInput"
    :color="$vuetify.theme.dark ? '#121212' : 'grey lighten-5'"
  >
    <insights-toolbar></insights-toolbar>
    <perfect-scrollbar style="height: calc(100vh - 152px)">
      <v-window v-model="currentWindow">
        <v-window-item :value="0">
          <daily-insights></daily-insights>
          <insights-on-demand></insights-on-demand>
        </v-window-item>
        <v-window-item :value="1">
          <insight-details></insight-details>
        </v-window-item>
      </v-window>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import InsightsToolbar from './Toolbar.vue';
import DailyInsights from './DailyInsights.vue';
import InsightsOnDemand from './InsightsOnDemand.vue';
import InsightDetails from './InsightDetails.vue';

export default {
  name: 'CoreInsights',
  components: {
    InsightsToolbar,
    DailyInsights,
    InsightsOnDemand,
    InsightDetails,
  },
  computed: {
    ...mapState('helper', ['insightsDrawer']),
    ...mapState('insight', ['window']),
    drawerInput: {
      get() {
        return this.insightsDrawer;
      },
      set(val) {
        this.setInsightsDrawer(val);
      },
    },
    currentWindow: {
      get() {
        return this.window;
      },
      set(val) {
        this.setWindow(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setInsightsDrawer']),
    ...mapMutations('insight', ['setWindow']),
  },
};
</script>
