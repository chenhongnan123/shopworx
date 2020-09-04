<template>
  <div style="height:100%">
    <portal to="app-header">
      Maintenance Summary
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="enterFullscreen"
      >
        <v-icon
          v-text="'$fullscreen'"
        ></v-icon>
      </v-btn>
      <customize-toggle class="ml-2" />
    </portal>
    <maintenance-summary-loading v-if="loading" />
    <template v-else>
      <dashboard-toolbar-extension />
      <widget-add-drawer />
      <detail-dashboard />
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import CustomizeToggle from '../components/CustomizeToggle.vue';
import MaintenanceSummaryLoading from './MaintenanceSummaryLoading.vue';
import DashboardToolbarExtension from '../components/DashboardToolbarExtension.vue';
import WidgetAddDrawer from '../components/WidgetAddDrawer.vue';
import DetailDashboard from '../components/DetailDashboard.vue';

export default {
  name: 'MaintenanceSummary',
  components: {
    CustomizeToggle,
    MaintenanceSummaryLoading,
    DashboardToolbarExtension,
    DetailDashboard,
    WidgetAddDrawer,
  },
  data() {
    return {
      isFullScreen: false,
      loading: false,
    };
  },
  async created() {
    this.setExtendedHeader(true);
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    enterFullscreen() {
      const elem = document.querySelector('#maintenance-summary');
      elem.onfullscreenchange = (event) => {
        const e = event.target;
        this.isFullScreen = document.fullscreenElement === e;
      };
      if (document.fullscreenEnabled) {
        if (!this.isFullScreen) {
          elem.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    },
  },
};
</script>
