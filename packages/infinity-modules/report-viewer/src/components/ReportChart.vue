<template>
  <div>
    <highcharts
      v-if="chartType && chartType.value"
      :options="options"
      style="height: 300px;"
      ref="chart"
    ></highcharts>
  </div>
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
          categories: [],
          title: {
            text: null,
          },
        },
        yAxis: {
          title: {
            text: null,
          },
        },
        series: [],
      },
    };
  },
  created() {
    this.updateChartType();
  },
  computed: {
    ...mapState('reports', ['chartType', 'report']),
  },
  watch: {
    chartType(val) {
      if (val) {
        this.updateChartType();
      }
    },
    report(val) {
      if (val && val.cols) {
        const col = val.cols.find((c) => c.type.toLowerCase() === 'string');
        const seriesCols = val.cols
          .filter((c) => c.type.toLowerCase() !== 'string' && c.type.toLowerCase() !== 'boolean')
          .map((c) => c.name);
        const colName = col && col.name;
        const categories = val && val.reportData
          ? val.reportData.map((data) => data[colName])
          : [];
        // eslint-disable-next-line
        const subset = (obj, keys) => keys.reduce((a, b) => (a[b] = obj[b], a), {});
        const series = val && val.reportData
          ? val.reportData.map((data) => subset(data, seriesCols))
          : [];
        this.updateCategory(categories);
        this.updateSeries(series, seriesCols);
      }
    },
  },
  methods: {
    updateChartType() {
      if (this.chartType) {
        this.options.chart.type = this.chartType.value;
      }
    },
    updateCategory(categories) {
      this.options.xAxis.categories = categories;
    },
    updateSeries(series, seriesCols) {
      this.options.series = seriesCols.map((col) => ({
        name: col,
        data: series.map((data) => data[col]),
      }));
    },
  },
};
</script>
