<template>
  <highcharts
    class="mt-4"
    :options="options"
    ref="aChart"
  ></highcharts>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PerformanceComparision',
  props: {
    thisMachines: {
      type: Array,
      required: true,
    },
    previousMachines: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.chart = this.$refs.aChart.chart;
    this.createSeries();
  },
  data() {
    return {
      chart: null,
      options: {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Performance comparision',
          style: {
            color: '',
          },
        },
        plotOptions: {
          series: {
            grouping: false,
            borderWidth: 0,
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          shared: true,
        },
        xAxis: {
          type: 'category',
          labels: {
            style: {
              color: '',
            },
          },
        },
        yAxis: [
          {
            title: {
              text: null,
            },
            labels: {
              style: {
                color: '',
              },
            },
          },
        ],
        series: [{}, {}],
      },
    };
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('userDashboard', [
      'thisDate',
      'thisShift',
      'previousDate',
      'previousShift',
    ]),
  },
  methods: {
    roundOff(val) {
      if (val) {
        return Math.round((val + Number.EPSILON) * 100) / 100;
      }
      return 0;
    },
    createSeries() {
      const prevData = this.previousMachines.map((m) => ({
        name: m.machinename,
        y: this.roundOff(m.p),
      }));
      const prevSeries = {
        color: 'rgb(158, 159, 163)',
        pointPlacement: -0.2,
        linkedTo: 'main',
        data: prevData,
        name: `${this.previousDate} ${this.previousShift}`,
      };
      const data = this.thisMachines.map((m) => ({
        name: m.machinename,
        y: this.roundOff(m.p),
      }));
      const series = {
        color: this.isDark ? '#21C77C' : '#354493',
        id: 'main',
        data,
        name: `${this.thisDate} ${this.thisShift}`,
      };
      this.options.series = [prevSeries, series];
    },
  },
  watch: {
    thisMachines: {
      deep: true,
      handler() {
        this.createSeries();
      },
    },
    isDark: {
      immediate: true,
      handler(val) {
        if (val) {
          this.options.title.style.color = '#FFFFFF';
          this.options.yAxis[0].labels.style.color = '#FFFFFF';
          this.options.xAxis.labels.style.color = '#FFFFFF';
          this.options.series[1].color = '#21C77C';
        } else {
          this.options.title.style.color = '#333333';
          this.options.yAxis[0].labels.style.color = '#666666';
          this.options.xAxis.labels.style.color = '#666666';
          this.options.series[1].color = '#354493';
        }
      },
    },
  },
};
</script>
