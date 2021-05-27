<template>
  <v-card-text>
    <highcharts
      v-if="options"
      :options="options"
      ref="featureChart"
    ></highcharts>
  </v-card-text>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ModelFeatures',
  props: {
    chartType: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState('processDashboard', ['parameters']),
    ...mapGetters('processDashboard', ['getRandomNumber']),
  },
  mounted() {
    const { chart } = this.$refs.featureChart;
    const [vis, grv, mos] = chart.series;
    for (let i = 0; i < 15; i += 1) {
      const x = new Date().getTime() - (i + 1) * 5000;
      const v = this.getRandomNumber({ min: 1, max: 10 });
      const s = this.getRandomNumber({ min: 1, max: 13 });
      const m = this.getRandomNumber({ min: 1, max: 500 });
      vis.addPoint([x, v], true, false);
      grv.addPoint([x, s], true, false);
      mos.addPoint([x, m], true, false);
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  watch: {
    chartType(val) {
      this.options.chart.type = val;
    },
    parameters: {
      deep: true,
      handler(val) {
        const { chart } = this.$refs.featureChart;
        const [vis, grv, mos] = chart.series;
        const {
          x,
          v,
          s,
          m,
        } = val;
        const shift = chart.series[0].data.length > 20;
        vis.addPoint([x, v], true, shift);
        grv.addPoint([x, s], true, shift);
        mos.addPoint([x, m], true, shift);
      },
    },
  },
  data() {
    return {
      interval: null,
      options: {
        chart: {
          type: 'line',
          height: 350,
          zoomType: 'xy',
        },
        title: {
          text: 'Neat oil/Hydraulic oil/Gear oil',
        },
        time: {
          useUTC: false,
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        yAxis: [
          {
            labels: {
              format: '{value} cst',
            },
            title: {
              text: 'Viscosity',
            },
          },
          {
            gridLineWidth: 0,
            title: {
              text: 'Specific gravity',
            },
            opposite: true,
          },
          {
            gridLineWidth: 0,
            labels: {
              format: '{value} PPM',
            },
            title: {
              text: 'Moisture content',
            },
            opposite: true,
          },
        ],
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          x: 80,
          verticalAlign: 'top',
          y: 55,
          floating: true,
        },
        series: [
          {
            name: 'Viscosity',
            data: [],
            yAxis: 1,
            tooltip: {
              valueSuffix: ' cst',
            },
          },
          {
            name: 'Specific gravity',
            data: [],
            yAxis: 2,
            dashStyle: 'shortdot',
          },
          {
            name: 'Moisture content',
            data: [],
            tooltip: {
              valueSuffix: ' PPM',
            },
          },
        ],
      },
    };
  },
};
</script>
