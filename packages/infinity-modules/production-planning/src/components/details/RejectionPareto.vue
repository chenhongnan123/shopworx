<template>
  <v-card
    flat
    rounded="lg"
  >
    <v-card-title primary-title>
      Total rejections: {{ totalRejections }} pcs
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
      totalRejections: 0,
    };
  },
  async created() {
    this.loading = true;
    const reportData = await this.getReportData('planrejectionpareto');
    this.options = reportData.chartOptions;
    this.options.chart.height = 300;
    this.totalRejections = reportData.totalRejection;
    this.loading = false;
  },
  methods: {
    ...mapActions('productionPlanning', ['getReportData']),
  },
};
</script>
