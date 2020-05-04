<template>
  <highcharts
    v-if="chartType && chartType.value"
    :options="options"
    ref="chart"
  ></highcharts>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ReportChart',
  data() {
    return {
      options: {
        chart: {
          type: 'column',
        },
        title: {
          text: null,
        },
        xAxis: {
          categories: ['28/01', '29/01', '30/01', '31/01', '01/02', '02/02', '03/02'],
          title: {
            text: null,
          },
        },
        yAxis: {
          title: {
            text: null,
          },
        },
        series: [{
          name: 'Availability',
          data: [94, 93.4, 96, 92, 97, 88, 91],
          color: '#354493',
          showInLegend: false,
        }],
      },
    };
  },
  created() {
    this.updateChartType();
    this.updateSeriesColor(this.isDark);
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('reports', ['chartType']),
  },
  watch: {
    isDark(val) {
      this.updateSeriesColor(val);
    },
    chartType(val) {
      if (val) {
        this.updateChartType();
      }
    },
  },
  methods: {
    updateSeriesColor(val) {
      this.options.series.forEach((s) => {
        if (val) {
          s.color = '#21C77C';
        } else {
          s.color = '#354493';
        }
      });
    },
    updateChartType() {
      if (this.chartType) {
        this.options.chart.type = this.chartType.value;
      }
    },
  },
};
</script>
