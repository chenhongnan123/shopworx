<template>
  <v-card-text>
    <highcharts
      v-if="options"
      :options="options"
      ref="predictionChart"
    ></highcharts>
  </v-card-text>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'ModelPredictions',
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
    const { chart } = this.$refs.predictionChart;
    const [con, ph] = chart.series;
    const min = 1;
    const max = 10;
    for (let i = 0; i < 15; i += 1) {
      const x = new Date().getTime() - ((i + 1) * 5000);
      const c = this.getRandomNumber({ min, max });
      const p = this.getRandomNumber({ min, max });
      con.addPoint([x, c], true, false);
      ph.addPoint([x, p], true, false);
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
        const { chart } = this.$refs.predictionChart;
        const [con, ph] = chart.series;
        const {
          x,
          c,
          p,
        } = val;
        const shift = chart.series[0].data.length > 20;
        con.addPoint([x, c], true, shift);
        ph.addPoint([x, p], true, shift);
      },
    },
  },
  data() {
    return {
      interval: null,
      options: {
        chart: {
          height: 250,
          type: 'areaspline',
          zoomType: 'xy',
        },
        time: {
          useUTC: false,
        },
        title: {
          text: 'Water soluble coolants',
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        yAxis: [{
          labels: {
            format: '{value}%',
          },
          title: {
            text: 'Percentage',
          },
        }, {
          gridLineWidth: 0,
          title: {
            text: 'pH',
          },
          opposite: true,
        }],
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        series: [
          {
            name: 'Concentration',
            data: [],
            lineWidth: 4,
            marker: {
              radius: 4,
            },
            yAxis: 1,
            tooltip: {
              valueSuffix: ' %',
            },
          },
          {
            name: 'pH',
            data: [],
          },
        ],
      },
    };
  },
};
</script>
