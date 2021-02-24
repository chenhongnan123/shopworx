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
  name: 'QualityComparision',
  inject: ['theme'],
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
          text: 'Quality comparision',
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
        },
        yAxis: [
          {
            title: {
              text: null,
            },
          },
        ],
        series: [],
      },
    };
  },
  computed: {
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
        y: this.roundOff(m.q),
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
        y: this.roundOff(m.q),
      }));
      const series = {
        color: this.theme.isDark ? '#21C77C' : '#354493',
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
  },
};
</script>
