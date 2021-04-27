<template>
  <v-card
    flat
    height="100%"
    rounded="lg"
  >
    <v-card-title primary-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-responsive :max-width="150">
        <v-select
          dense
          filled
          :items="reports"
          v-model="reportName"
          hide-details
          single-line
        ></v-select>
      </v-responsive>
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
  name: 'CycletimeTrend',
  data() {
    return {
      loading: false,
      options: null,
      reports: [{
        text: this.$t('planning.HOURLY'),
        value: 'hourlyplancycletimetrend',
      }, {
        text: this.$t('planning.SHIFTWISE'),
        value: 'shiftplancycletimetrend',
      }],
      reportName: null,
    };
  },
  async created() {
    this.loading = true;
    this.reportName = this.reports[0].value;
    const reportData = await this.getReportData(this.reportName);
    this.options = reportData.chartOptions;
    this.options.chart.height = 150;
    this.loading = false;
  },
  computed: {
    title() {
      return this.reportName === 'shiftplancycletimetrend'
        ? this.$t('planning.shiftwiseCtTrend')
        : this.$t('planning.hourlyCtTrend');
    },
  },
  watch: {
    async reportName() {
      this.loading = true;
      const reportData = await this.getReportData(this.reportName);
      this.options = reportData.chartOptions;
      this.options.chart.height = 150;
      this.loading = false;
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['getReportData']),
  },
};
</script>
