<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0 px-2 font-weight-medium text-justify">
      <span>You asked:&nbsp;</span>
      <strong v-text="query.name"></strong>
    </v-card-text>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <v-card-text
      class="text-center"
      v-if="insightDetails
        && insightDetails.type
        && insightDetails.type.toUpperCase().includes('CHART')"
    >
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <highcharts :options="options"></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text
      class="text-justify"
      v-if="insightDetails
        && insightDetails.type
        && insightDetails.type.toUpperCase().includes('HTML')"
      >
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <div v-html="insightDetails.html"></div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InsightDetails',
  data() {
    return {
      options: null,
    };
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('insight', ['query', 'window', 'loading', 'insightDetails']),
  },
  methods: {
    setColors(options) {
      const opt = { ...options };
      opt.title.style = {};
      opt.title.style.color = this.isDark ? '#FFFFFF' : '#333333';
      opt.yAxis = options.yAxis.map((axis) => {
        const labels = {
          style: { color: this.isDark ? '#FFFFFF' : '#666666' },
        };
        if (axis.labels) {
          return { ...axis, labels: { ...axis.labels, ...labels } };
        }
        return {
          ...axis,
          labels,
        };
      });
      opt.xAxis.labels = {};
      opt.xAxis.labels.style = {};
      opt.xAxis.labels.style.color = this.isDark ? '#FFFFFF' : '#666666';
      opt.legend = {};
      opt.legend.itemStyle = {};
      opt.legend.itemStyle.color = this.isDark ? '#FFFFFF' : '#333333';
      return opt;
    },
  },
  watch: {
    insightDetails(val) {
      if (val) {
        this.options = this.setColors(val.chartOptions);
      }
    },
    isDark() {
      if (this.insightDetails) {
        this.options = this.setColors(this.insightDetails.chartOptions);
      }
    },
  },
};
</script>
