<template>
  <v-container fluid class="py-0">
    <template v-if="loading">
      <v-progress-linear :indeterminate="true"></v-progress-linear>
    </template>
    <v-row justify="center">
      <v-col cols="12" class="py-0">
        <!-- <report-chart /> -->
        <report-grid ref="reportGrid" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
// import ReportChart from './ReportChart.vue';
import ReportGrid from './ReportGrid.vue';

export default {
  name: 'ReportContainer',
  components: {
    // ReportChart,
    ReportGrid,
  },
  computed: {
    ...mapState('reports', ['reportMapping', 'dateRange', 'loading']),
  },
  watch: {
    reportMapping(val) {
      if (val) {
        this.runReport();
      }
    },
    dateRange() {
      this.runReport();
    },
  },
  methods: {
    ...mapActions('reports', ['executeReport']),
    async runReport() {
      await this.executeReport();
      this.$refs.reportGrid.restoreState();
    },
    exportReport(type) {
      if (type === 'gridCSV') {
        this.$refs.reportGrid.exportGridCSV();
      } else if (type === 'gridExcel') {
        this.$refs.reportGrid.exportGridExcel();
      }
    },
  },
};
</script>
