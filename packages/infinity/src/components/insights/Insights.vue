<template>
  <v-navigation-drawer
    app
    right
    clipped
    v-if="!isMobile"
    width="290"
    v-model="drawerInput"
  >
    <insights-toolbar></insights-toolbar>
    <perfect-scrollbar style="height: calc(100% - 48px)">
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
  <v-dialog
    v-model="drawerInput"
    fullscreen
    v-else
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <insights-toolbar></insights-toolbar>
      <perfect-scrollbar style="height: calc(100% - 48px)">
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
    </v-card>
  </v-dialog>
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
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
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
