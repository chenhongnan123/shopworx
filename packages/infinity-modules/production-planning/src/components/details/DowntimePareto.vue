<template>
  <v-card
    flat
    rounded="lg"
  >
    <v-card-title primary-title>
      Total downtime: {{ totalDowntime }}
    </v-card-title>
    <v-card-text>
      <highcharts
        v-if="options"
        :options="options"
      ></highcharts>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RejectionPareto',
  data() {
    return {
      loading: false,
      options: null,
      totalDowntime: '-',
    };
  },
  async created() {
    this.loading = true;
    const reportData = await this.getReportData('plandowntimepareto');
    this.options = reportData.chartOptions;
    this.options.chart.height = 300;
    this.totalDowntime = reportData.totalDowntime;
    this.loading = false;
  },
  methods: {
    ...mapActions('productionPlanning', ['getReportData']),
  },
};
</script>
