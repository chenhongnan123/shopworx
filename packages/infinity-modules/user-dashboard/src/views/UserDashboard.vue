<template>
  <div>
    <portal to="app-header">
      Home
    </portal>
    <v-card flat class="transparent px-4">
      <v-row>
        <!-- <v-col cols="12" sm="6" md="3">
          <stats-widget
            :icon="{ color: 'success', name: '$production' }"
            :title="'Running'"
            :stat="7"
            :action="{ text: 'Running machines', route: '/machine-dashboard?filter=running==true' }"
          ></stats-widget>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <stats-widget
            :icon="{ color: 'error', name: '$downtime' }"
            :title="'Down'"
            :stat="3"
            :action="{ text: 'Down machines', route: '/machine-dashboard?filter=down==true' }"
          ></stats-widget>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <stats-widget
            :icon="{ color: 'info', name: 'mdi-calendar-remove-outline' }"
            :title="'No Plan'"
            :stat="7"
            :action="{ text: 'No plan machines', route: '/machine-dashboard?filter=noplan==true' }"
          ></stats-widget>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <stats-widget
            :icon="{ color: 'warning', name: '$rejection' }"
            :title="'Purge'"
            :stat="7"
            :action="{ text: 'Purge machines', route: '/machine-dashboard?filter=purge==true' }"
          ></stats-widget>
        </v-col>
        <v-col cols="12" md="7">
          <tabbed-chart-widget
            showDateFilter
            :title="'How is my site performing?'"
            :action="{ text: 'Performance Overview', route: '/report/productionbyshift' }"
          ></tabbed-chart-widget>
        </v-col>
        <v-col cols="12" md="5">
          <list-widget></list-widget>
        </v-col> -->
        <v-col cols="12" md="12" class="text-center mt-6">
          <span class="headline my-auto">
            Watch out for this section in 4.1.0-rc.3
          </span>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
/* import TabbedChartWidget from '../components/TabbedChartWidget.vue';
import ChartWidget from '../components/ChartWidget.vue';
import StatsWidget from '../components/StatsWidget.vue';
import ListWidget from '../components/ListWidget.vue'; */

export default {
  name: 'UserDashboard',
  /* components: {
    TabbedChartWidget,
    ChartWidget,
    StatsWidget,
    ListWidget,
  }, */
};
</script>
