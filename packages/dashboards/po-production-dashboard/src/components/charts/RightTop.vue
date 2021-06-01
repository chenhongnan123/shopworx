<template>
  <div class='right-top'>
    <div class='sub-title'>
      <span>PRODUCTION & RESULT</span>
    </div>
    <highcharts :options="options"></highcharts>
  </div>
</template>

<script>
export default {
  name: 'RightTop',
  data() {
    return {
      options: {
        colors: ['#55D802', '#C02316'],
        chart: {
          type: 'column',
          height: '20%',
        },
        title: {
          text: '',
          style: {
            color: '#fff',
          },
        },
        subtitle: {
          text: '',
        },
        yAxis: {
          title: {
            text: '',
          },
          labels: {
            style: {
              color: '#fff',
            },
          },
          gridLineColor: 'rgba(255,255,255,.1)',
        },
        legend: {
          enabled: false,
        },
        xAxis: {
          labels: {
            style: {
              color: '#fff',
            },
          },
        },
        series: [{
          name: '',
          data: [20, 30, 100],
        }],
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              style: {
                fontSize: 20,
                color: '#fff',
              },
            },
          },
        },
        tooltip: {
          shared: true,
          useHTML: true,
          pointFormatter() {
            const { name } = this.series;
            if (this.x % 2 === 0 || this.x === 1) {
              return `${this.category}: ${this.y}`;
            }
            return `${name}: ${this.y}<br/>`;
          },
        },
      },
      stationlist: [
        '105mobile',
        '106mobile',
        '201fixed',
        '201mobile',
        '202fixed',
        '202mobile',
        '203mobile',
        '204mobile',
      ],
    };
  },
  props: ['reportdata'],
  methods: {
    handleChartsData(reportdata) {
      const { confidencebyoperation } = reportdata;
      const okpredictioncountlist = confidencebyoperation
        .filter((i) => i.prediction === 1)
        .map((i) => i.predictioncount).sort((a, b) => a - b);
      const ngpredictioncountlist = confidencebyoperation
        .filter((i) => i.prediction === -1)
        .map((i) => i.predictioncount).sort((a, b) => a - b);
      const series = [{
        name: 'Overheat',
        colorByPoint: true,
        data: [okpredictioncountlist[0] || 0,
          ngpredictioncountlist[ngpredictioncountlist.length - 1] || 0],
        stack: 'same',
      },
      {
        name: 'Double',
        colorByPoint: true,
        data: [null, null],
        stack: 'same',
      }];
      const categories = ['OK COUNT', 'NG COUNT'];
      const { stationlist } = this;
      const stationinfolist = [];
      stationlist.forEach((station) => {
        const stationinfo = confidencebyoperation
          .filter((confidence) => confidence.operationname.includes(station));
        stationinfolist.push({ stationname: station, stationinfo });
      });
      stationinfolist.forEach((stationinfoobj) => {
        const { stationname, stationinfo } = stationinfoobj;
        if (stationinfo.length > 0) {
          if (stationinfo.find((i) => i.prediction === 1)) {
            const list = stationinfo.filter((i) => i.prediction === 1)
              .map((i) => i.predictioncount);
            series[0].data.push(Math.min.apply(null, list));
            series[1].data.push(null);
          } else {
            series[0].data.push(0);
            series[1].data.push(null);
          }
          const stationinfominus1 = stationinfo.filter((i) => i.prediction === -1);
          if (stationinfominus1.length > 0) {
            if (stationinfominus1.find((i) => i.operationname.includes('overheat'))) {
              series[0].data.push(stationinfominus1.find((i) => i.operationname.includes('overheat')).predictioncount);
            } else {
              series[0].data.push(0);
            }
            if (stationinfominus1.find((i) => i.operationname.includes('double'))) {
              series[1].data.push(stationinfominus1.find((i) => i.operationname.includes('double')).predictioncount);
            } else {
              series[1].data.push(0);
            }
          } else {
            series[0].data.push(0);
            series[1].data.push(null);
          }
          categories.push(`${stationname} OK`, `${stationname} NG`);
        }
      });
      console.log(stationinfolist, 'stationinfolist');
      console.log(categories, 'categories');
      console.log(series, 'series');
      this.options.xAxis.categories = categories;
      this.options.series = series;
    },
  },
  watch: {
    reportdata: {
      handler(reportdata) {
        this.handleChartsData(reportdata);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style scoped lang='scss'>
  .right-top{
    height: 100%;
    .sub-title{
      height: 4vh;
      font-size: 2vh;
      line-height: 4vh;
      background-color: #245692;
      padding: 0 2vh;
    }
    >.row{
      >.col{
        div{
          font-size: 2vh;
          line-height: 3vh;
          opacity: 0.7;
        }
        >h3{
          font-size: 2.3vh;
          line-height: 4vh;
        }
      }
    }
  }
</style>
