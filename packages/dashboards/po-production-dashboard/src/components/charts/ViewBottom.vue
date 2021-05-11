<template>
  <div class='view-bottom'>
    <v-carousel
      cycle
      hide-delimiter-background
      show-arrows-on-hover
      :show-arrows="false"
      :interval="10000"
      height="100%"
    >
      <v-carousel-item>
        <div class="carousel-item-container d-flex flex-wrap">
          <div class="charts" v-for="(item, k) in stationinfoone" :key="k">
            <div
            class="sub-title"
            :style="{background:reportdata.confidencebyhotplate
            .some(confidence =>confidence.operationtype.includes(item.stationid)&&
            (confidence.prediction !== 1))?
            '#C02316':'#245692'}">
              <span>OP {{item.stationname}}</span>
            </div>
            <v-row>
              <v-col cols="6" v-for="(paraminfo, key) in item.paraminfo" :key="key">
                <highcharts :options="paraminfo.paramoptions" theme="dark"></highcharts>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="carousel-item-container d-flex flex-wrap">
          <div  v-for="(item, k) in stationinfotwo" :key="k" :class="`charts ${k > 2 && 'mt-5'}`">
            <div
            class="sub-title"
            :style="{background:reportdata.confidencebyhotplate
            .some(confidence =>confidence.operationtype.includes(item.stationid)&&
            (confidence.prediction !== 1))?
            '#C02316':'#245692'}">
              <span>OP {{item.stationname}}</span>
            </div>
            <v-row>
              <v-col cols="6" v-for="(paraminfo, key) in item.paraminfo" :key="key">
                <highcharts :options="paraminfo.paramoptions" theme="dark"></highcharts>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

const options = {
  colors: ['#ff9800', '#edf285'],
  chart: {
    type: 'line',
    height: '83%',
  },
  title: {
    text: 'fixed',
    style: {
      color: '#fff',
    },
  },
  subtitle: {
    text: '',
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    categories: [],
    labels: {
      enabled: false,
    },
  },
  series: [{
    name: '',
    data: [],
  }],
};
export default {
  name: 'LeftTop',
  data() {
    return {
      options,
      stationinfoone: [
        {
          stationname: '105 Mobile',
          stationid: '105mob',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
        {
          stationname: '106 Mobile',
          stationid: '105mob',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
      ],
      stationinfotwo: [
        {
          stationname: '201 Fixed',
          stationid: '201fix',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
        {
          stationname: '201 Mobile',
          stationid: '201mob',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
        {
          stationname: '202 Fixed',
          stationid: '202fix',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
        {
          stationname: '202 Mobile',
          stationid: '202mob',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
        {
          stationname: '203 Mobile',
          stationid: '203mob',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
        {
          stationname: '204 Mobile',
          stationid: '204mob',
          paraminfo: [
            {
              paramname: 'pid',
            },
            {
              paramname: 'temp',
            },
          ],
        },
      ],
    };
  },
  props: ['reportdata'],
  computed: {
    ...mapState('poProductionDashboard', [
      'reportdata258',
      'reportdata259',
    ]),
  },
  methods: {
    handleReportData(reportdata, stationinfo, type) {
      if (!reportdata) {
        return false;
      }
      this[type] = stationinfo.map((stationinfoobj) => {
        let { paraminfo } = stationinfoobj;
        const { stationid } = stationinfoobj;
        paraminfo = paraminfo.map((paraminfoobj) => {
          const { paramname, paramoptions } = paraminfoobj;
          const series = [
            {
              name: '',
              data: reportdata.map((item) => {
                if (paramname === 'pid') {
                  return item[`op${stationid}pidact`] || 0;
                }
                return item[`op${stationid}tempact1`] / 10 || 0;
              }),
            },
          ];
          return { ...paraminfoobj, paramoptions: { ...paramoptions, series } };
        });
        return { ...stationinfoobj, paraminfo };
      });
      return true;
    },
  },
  watch: {
    reportdata258: {
      handler(reportdata258) {
        const { stationinfoone } = this;
        this.handleReportData(reportdata258, stationinfoone, 'stationinfoone');
      },
      deep: true,
      immediate: true,
    },
    reportdata259: {
      handler(reportdata259) {
        const { stationinfotwo } = this;
        this.handleReportData(reportdata259, stationinfotwo, 'stationinfotwo');
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    const { stationinfoone, stationinfotwo } = this;
    this.stationinfoone = stationinfoone.map((stationinfoobj) => {
      let { paraminfo } = stationinfoobj;
      paraminfo = paraminfo.map((paraminfoobj) => {
        // console.log(paraminfoobj, 'paraminfoobj');
        let paramoptions = {};
        if (paraminfoobj.paramname === 'pid') {
          paramoptions = {
            ...options,
            colors: ['#edf285'],
            title: {
              text: 'PID',
              style: {
                color: '#fff',
              },
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
              max: 100,
              min: 0,
              gridLineColor: 'rgba(255,255,255,.1)',
            },
          };
        } else {
          paramoptions = {
            ...options,
            title: {
              text: 'TEMPERATURE',
              style: {
                color: '#fff',
              },
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
              allowDecimals: true,
              gridLineColor: 'rgba(255,255,255,.1)',
            },
          };
        }
        return { ...paraminfoobj, paramoptions };
      });
      return { ...stationinfoobj, paraminfo };
    });
    this.stationinfotwo = stationinfotwo.map((stationinfoobj) => {
      let { paraminfo } = stationinfoobj;
      paraminfo = paraminfo.map((paraminfoobj) => {
        console.log(paraminfoobj, 'paraminfoobj');
        let paramoptions = {};
        if (paraminfoobj.paramname === 'pid') {
          paramoptions = {
            ...options,
            colors: ['#edf285'],
            title: {
              text: 'PID',
              style: {
                color: '#fff',
              },
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
              max: 100,
              min: 0,
              gridLineColor: 'rgba(255,255,255,.1)',
            },
          };
        } else {
          paramoptions = {
            ...options,
            title: {
              text: 'TEMPERATURE',
              style: {
                color: '#fff',
              },
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
              allowDecimals: true,
              gridLineColor: 'rgba(255,255,255,.1)',
            },
          };
        }
        return { ...paraminfoobj, paramoptions };
      });
      return { ...stationinfoobj, paraminfo };
    });
    console.log(this.stationinfoone, 'this.stationinfoone');
  },
};
</script>
<style scoped lang='scss'>
  .view-bottom{
    height: 100%;
    border-radius: 18px;
    overflow: hidden;
    .sub-title{
      height: 4vh;
      font-size: 2vh;
      line-height: 4vh;
      // background-color: #245692;
      padding: 0 2vh;
    }
    .carousel-item-container{
      width: 100%;
      height: 100%;
    }
    .charts{
      background: #283B52;
      height: 48%;
      width: 33%;
      margin-left: 0.5%;
      border-radius: 18px;
      overflow: hidden;
    }
    .charts:nth-child(1){
      margin: 0;
    }
    .charts:nth-child(4){
      margin: 0;
    }
  }
</style>
