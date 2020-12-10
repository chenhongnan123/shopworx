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
export default {
  name: 'ModelFeatures',
  mounted() {
    const { chart } = this.$refs.featureChart;
    const [
      fivePid,
      sevenPid,
      cfPid,
      maxPid,
      meanPid,
    ] = chart.series;
    for (let i = 0; i < 15; i += 1) {
      const x = new Date().getTime() - ((i + 1) * 5000);
      const f = parseFloat(((Math.random() * 40) + 30).toFixed(2), 10);
      const s = parseFloat(((Math.random() * 60) + 50).toFixed(2), 10);
      const c = ((Math.random() * 2) + 1);
      const ma = parseFloat(((Math.random() * 60) + 50).toFixed(2), 10);
      const me = ((Math.random() * 40) + 25);
      fivePid.addPoint([x, f], true, false);
      sevenPid.addPoint([x, s], true, false);
      cfPid.addPoint([x, c], true, false);
      maxPid.addPoint([x, ma], true, false);
      meanPid.addPoint([x, me], true, false);
    }
    this.interval = setInterval(() => {
      const x = new Date().getTime();
      const shift = chart.series[0].data.length > 20;
      const f = parseFloat(((Math.random() * 40) + 30).toFixed(2), 10);
      const s = parseFloat(((Math.random() * 60) + 50).toFixed(2), 10);
      const c = ((Math.random() * 2) + 1);
      const ma = parseFloat(((Math.random() * 60) + 50).toFixed(2), 10);
      const me = ((Math.random() * 40) + 25);
      fivePid.addPoint([x, f], true, shift);
      sevenPid.addPoint([x, s], true, shift);
      cfPid.addPoint([x, c], true, shift);
      maxPid.addPoint([x, ma], true, shift);
      meanPid.addPoint([x, me], true, shift);
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  data() {
    return {
      interval: null,
      options: {
        chart: {
          height: 350,
        },
        title: {
          text: 'Model features',
        },
        time: {
          useUTC: false,
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
        },
        yAxis: {
          title: {
            text: 'Values',
          },
        },
        tooltip: {
          shared: true,
          crosshairs: true,
        },
        series: [
          {
            name: '0.50_PID',
            data: [],
          },
          {
            name: '0.75_PID',
            data: [],
          },
          {
            name: 'crest_factor_PID',
            data: [],
          },
          {
            name: 'max_PID',
            data: [],
          },
          {
            name: 'mean_PID',
            data: [],
          },
        ],
      },
    };
  },
};
</script>
