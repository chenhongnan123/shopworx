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
export default {
  name: 'ModelPredictions',
  mounted() {
    const { chart } = this.$refs.predictionChart;
    const [goodClass, badClass] = chart.series;
    for (let i = 0; i < 15; i += 1) {
      const x = new Date().getTime() - ((i + 1) * 1000);
      const good = Math.random();
      const bad = 1 - good;
      goodClass.addPoint([x, good], true, false);
      badClass.addPoint([x, bad], true, false);
    }
    this.interval = setInterval(() => {
      const x = new Date().getTime();
      const good = Math.random();
      const bad = 1 - good;
      const shift = chart.series[0].data.length > 20;
      goodClass.addPoint([x, good], true, shift);
      badClass.addPoint([x, bad], true, shift);
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  data() {
    return {
      interval: null,
      options: {
        chart: {
          height: 200,
          type: 'areaspline',
        },
        time: {
          useUTC: false,
        },
        title: {
          text: 'Model predictions',
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        yAxis: {
          max: 1,
          title: {
            text: 'Probability',
          },
        },
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        legend: {
          enabled: false,
        },
        series: [
          {
            name: 'Good class',
            data: [],
            lineWidth: 4,
            marker: {
              radius: 4,
            },
          },
          {
            name: 'Bad class',
            data: [],
          },
        ],
      },
    };
  },
};
</script>
