<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <div class="mt-1">
        <span class="title">
          {{ currentShift }} - {{ date }}
        </span>
      </div>
      <div class="ml-4">
        <v-icon color="success">mdi-checkbox-blank-circle</v-icon>
        <span> - {{ $t('shopfloorDashboard.up') }}</span>
      </div>
      <div class="ml-2">
        <v-icon color="error">mdi-checkbox-blank-circle</v-icon>
        <span> - {{ $t('shopfloorDashboard.down') }}</span>
      </div>
      <v-spacer></v-spacer>
      <time-selection />
      <cell-selection class="ml-2" />
      <auto-run class="ml-2" />
    </v-toolbar>
  </portal>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';
import TimeSelection from './TimeSelection.vue';
import CellSelection from './CellSelection.vue';
import AutoRun from './AutoRun.vue';

export default {
  name: 'DashboardToolbarExtension',
  components: {
    TimeSelection,
    CellSelection,
    AutoRun,
  },
  data() {
    return {
      interval: null,
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getBusinessTime();
    }, 60000);
    this.getBusinessTime();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    ...mapState('machineDashboard', ['currentShift', 'currentDate']),
    date() {
      return formatDate(new Date(this.currentDate), 'PP');
    },
  },
  methods: {
    ...mapActions('machineDashboard', ['getBusinessTime']),
  },
};
</script>
