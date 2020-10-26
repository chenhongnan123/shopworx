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
        const categoryColumns = val.cols.filter((c) => c.type.toLowerCase() === 'string');
        const seriesName = val.cols
          .filter((c) => c.type.toLowerCase() !== 'string' && c.type.toLowerCase() !== 'boolean')
          .map((c) => c.name);
        const seriesDescription = seriesName.map((key) => {
          const column = val.cols.find((c) => c.name === key);
          return {
            name: column.name,
            description: column.description,
          };
        });
        const categories = val && val.reportData
          ? val.reportData.map((data) => categoryColumns.reduce((a, b) => {
            // eslint-disable-next-line
            a =`${a} ${data[b.name]}`;
            return a;
          }, ''))
          : [];
        // eslint-disable-next-line
        const subset = (obj, keys) => keys.reduce((a, b) => (a[b] = obj[b], a), {});
        const series = val && val.reportData
          ? val.reportData.map((data) => subset(data, seriesName))
          : [];
        this.updateCategory(categories);
        this.updateSeries(series, seriesName, seriesDescription);
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
    updateSeries(series, seriesCols, seriesDescription) {
      this.options.series = seriesCols.map((col) => {
        const { description } = seriesDescription.find((s) => s.name === col);
        return {
          name: description,
          data: series.map((data) => data[col]),
        };
      });
    },
  },
};
</script>
