<template>
  <!-- <div class="op-charts">
    <div class="sub-title">
      <span>{{'OVERALL RESULT HISTORY'}}</span>
    </div>
  </div> -->
  <v-row class="op-charts">
    <v-col cols="4" class="pr-2">
      <div class="charts">
        <div class="sub-title" :style="{background:confidenceData.confidencebyhotplate.some(item => item.operationtype.includes('201')&&(item.prediction !== 1))?'#C02316':'#245692'}">
          <span>{{'OP105'}}</span>
          <div class="sign">
            <i></i>
            <span>Fixed</span>
            <i></i>
            <span>Mobile</span>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <highcharts :options="pid105" theme="dark"></highcharts>
          </v-col>
          <v-col cols="6">
            <highcharts :options="temp105" theme="dark"></highcharts>
          </v-col>
        </v-row>
      </div>
      <div class="charts mt-2">
        <div class="sub-title" :style="{background:confidenceData.confidencebyhotplate.some(item => item.operationtype.includes('301')&&(item.prediction !== 1))?'#C02316':'#245692'}">
          <span>{{'OP202'}}</span>
          <div class="sign">
            <i></i>
            <span>Fixed</span>
            <i></i>
            <span>Mobile</span>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <highcharts :options="pid202" theme="dark"></highcharts>
          </v-col>
          <v-col  cols="6">
            <highcharts :options="temp202" theme="dark"></highcharts>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col cols="4"  class="pr-2">
      <div class="charts">
        <div class="sub-title" :style="{background:confidenceData.confidencebyhotplate.some(item => item.operationtype.includes('203')&&(item.prediction !== 1))?'#C02316':'#245692'}">
          <span>{{'OP106'}}</span>
          <div class="sign">
            <i></i>
            <span>Fixed</span>
            <i></i>
            <span>Mobile</span>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <highcharts :options="pid106" theme="dark"></highcharts>
          </v-col>
          <v-col  cols="6">
            <highcharts :options="temp106" theme="dark"></highcharts>
          </v-col>
        </v-row>
      </div>
      <div class="charts mt-2">
        <div class="sub-title" :style="{background:confidenceData.confidencebyhotplate.some(item => item.operationtype.includes('303')&&(item.prediction !== 1))?'#C02316':'#245692'}">
          <span>{{'OP203'}}</span>
          <div class="sign">
            <i></i>
            <span>Fixed</span>
            <i></i>
            <span>Mobile</span>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <highcharts :options="pid203" theme="dark"></highcharts>
          </v-col>
          <v-col cols="6">
            <highcharts :options="temp203" theme="dark"></highcharts>
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col cols="4">
      <div class="charts">
        <div class="sub-title" :style="{background:confidenceData.confidencebyhotplate.some(item => item.operationtype.includes('203')&&(item.prediction !== 1))?'#C02316':'#245692'}">
          <span>{{'OP201'}}</span>
          <div class="sign">
            <i></i>
            <span>Fixed</span>
            <i></i>
            <span>Mobile</span>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <highcharts :options="pid201" theme="dark"></highcharts>
          </v-col>
          <v-col  cols="6">
            <highcharts :options="temp201" theme="dark"></highcharts>
          </v-col>
        </v-row>
      </div>
      <div class="charts mt-2">
        <div class="sub-title" :style="{background:confidenceData.confidencebyhotplate.some(item => item.operationtype.includes('303')&&(item.prediction !== 1))?'#C02316':'#245692'}">
          <span>{{'OP204'}}</span>
          <div class="sign">
            <i></i>
            <span>Fixed</span>
            <i></i>
            <span>Mobile</span>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <highcharts :options="pid204" theme="dark"></highcharts>
          </v-col>
          <v-col cols="6">
            <highcharts :options="temp204" theme="dark"></highcharts>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {  mapState } from 'vuex';
import Moment from 'moment';
const chartsData = {
    colors: ['#ff9800','#edf285'],
    chart: {
      type: 'line',
      height:'75%',
    },
    title: {
      text: 'fixed',
      style:{
        color:'#fff'
      }
    },
    subtitle: {
      text: ''
    },
    yAxis: {
      title: {
        text: ''
      },
      gridLineColor: 'rgba(255,255,255,.1)'
    },
    xAxis:{
      categories:[1,2]
    },
    // series:[]
  }

export default {
  name: 'OpCharts',
  data() {
    return {
      pid105:{
        ...chartsData,
        title: {
          text: 'PID',
          style:{
            color:'#fff'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          max:100,
          min:0,
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series:[]
      },
      temp105:{
        ...chartsData,
        title: {
          text: 'TEMPERATURE',
          style:{
            color:'#fff'
          }
        },
        series:[]
      },
      pid106:{
        ...chartsData,
        title: {
          text: 'PID',
          style:{
            color:'#fff'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          max:100,
          min:0,
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series:[]
      },
      temp106:{
        ...chartsData,
        title: {
          text: 'TEMPERATURE',
          style:{
            color:'#fff'
          }
        },
        series:[]
      },
      pid201:{
        ...chartsData,
        title: {
          text: 'PID',
          style:{
            color:'#fff'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          max:100,
          min:0,
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series:[]
      },
      temp201:{
        ...chartsData,
        title: {
          text: 'TEMPERATURE',
          style:{
            color:'#fff'
          }
        },
        series:[]
      },
      pid202:{
        ...chartsData,
        title: {
          text: 'PID',
          style:{
            color:'#fff'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          max:100,
          min:0,
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series:[]
      },
      temp202:{
        ...chartsData,
        title: {
          text: 'TEMPERATURE',
          style:{
            color:'#fff'
          }
        },
        series:[]
      },
      pid203:{
        ...chartsData,
        title: {
          text: 'PID',
          style:{
            color:'#fff'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          max:100,
          min:0,
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series:[]
      },
      temp203:{
        ...chartsData,
        title: {
          text: 'TEMPERATURE',
          style:{
            color:'#fff'
          }
        },
        series:[]
      },
      pid204:{
        ...chartsData,
        title: {
          text: 'PID',
          style:{
            color:'#fff'
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          max:100,
          min:0,
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        series:[]
      },
      temp204:{
        ...chartsData,
        title: {
          text: 'TEMPERATURE',
          style:{
            color:'#fff'
          }
        },
        series:[]
      },
    }
  },
  mounted() {
    this.handleChartsDataF2(this.chartsDataF2);
    // this.handleChartsDataF3(this.chartsDataF3);
  },
  computed:{
    ...mapState({
      chartsDataF2: state => state.dashboard.chartsDataF2,
      // chartsDataF3: state => state.dashboard.chartsDataF3,
    }),
  },
  props: [ 'confidenceData' ],
  watch: {
    chartsDataF2: {
      handler(list) {
        this.handleChartsDataF2(list);
      },
      deep: true,
      immediate: true
    },
    // chartsDataF3: {
    //   handler(list) {
    //     this.handleChartsDataF3(list);
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // confidenceData: {
    //   handler(confidenceData) {
    //     this.handleChartsDataF2(list);
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods:{
    handleChartsDataF2(chartsData1) {
      if (!chartsData1) return;
      const chartsData = [...chartsData1].reverse();
      this.pid105.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.temp105.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.pid106.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.temp106.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.pid201.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.temp201.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.pid202.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.temp202.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.pid203.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.temp203.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.pid204.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.temp204.xAxis = {
        categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
      }
      this.pid105.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op105FixedHpPID)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op105MobileHpPID)
      }];

      this.temp105.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op105FixedHpTemp)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op105MobileHpTemp)
      }];
      this.pid106.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op106FixedHpPID)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op106MobileHpPID)
      }];

      this.temp106.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op106FixedHpTemp)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op106MobileHpTemp)
      }];
      this.pid201.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op201FixedHpPID)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op201MobileHpPID)
      }];

      this.temp201.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op201FixedHpTemp)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op201MobileHpTemp)
      }];

      this.pid202.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op202FixedHpPID)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op202MobileHpPID)
      }];

      this.temp202.series = [{
        name:'Fixed',
        data:chartsData.map(i => i.Op202FixedHpTemp)
      },{
        name:'Mobile',
        data:chartsData.map(i => i.Op202MobileHpTemp)
      }];

      this.pid203.series = [{
        name:'Mobile',
        data:chartsData.map(i => i.Op203MobileHpPID)
      }];

      this.temp203.series = [,{
        name:'Mobile',
        data:chartsData.map(i => i.Op203MobileHpTemp)
      }];
      this.pid204.series = [{
        name:'Mobile',
        data:chartsData.map(i => i.Op204MobileHpPID)
      }];

      this.temp204.series = [{
        name:'Mobile',
        data:chartsData.map(i => i.Op204MobileHpTemp)
      }];
    },
    // handleChartsDataF3(chartsData1) {
    //   if (!chartsData1) return;
    //   const chartsData = [...chartsData1].reverse();
    //   this.pid301.xAxis.categories = chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'));
    //   this.pid301.xAxis = {
    //     categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
    //   }
    //   this.temp301.xAxis = {
    //     categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
    //   }
    //   this.pid303.xAxis = {
    //     categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
    //   }
    //   this.temp303.xAxis = {
    //     categories:chartsData.map(i => Moment(i.timestamp).format('hh:mm:ss'))
    //   }
    //   this.pid301.series = [{
    //     name:'Fixed',
    //     data:chartsData.map(i => i.Op301FixedHpPID)
    //   },{
    //     name:'Mobile',
    //     data:chartsData.map(i => i.Op301MobileHpPID)
    //   }];

    //   this.temp301.series = [{
    //     name:'Fixed',
    //     data:chartsData.map(i => i.Op301FixedHpTemp)
    //   },{
    //     name:'Mobile',
    //     data:chartsData.map(i => i.Op301MobileHpTemp)
    //   }];

    //   this.pid303.series = [{
    //     name:'Fixed',
    //     data:[]
    //   },{
    //     name:'Mobile',
    //     data:chartsData.map(i => i.Op303MobileHpPID)
    //   }];

    //   this.temp303.series = [{
    //     name:'Fixed',
    //     data:[]
    //   },{
    //     name:'Mobile',
    //     data:chartsData.map(i => i.Op303MobileHpTemp)
    //   }];
    // }
  }
}
</script>

<style scoped lang="scss">
  .op-charts{
    .col{
      border-radius: .18rem;
      .sub-title{
        position: relative;
        >div{
          position: absolute;
          right: 10px;
          top: 0;
          >i{
            display: inline-block;
            width: 20px;
            height: 10px;
            margin:0 10px;
          }
          >i:nth-child(1){
            background: #ff9800;
          }
          >i:nth-child(3){
            background: #edf285;
          }
        }
      }
      .charts{
        background: #283B52;
        height: 2.7rem;
        border-radius: 0.18rem;
      }
    }
  }
</style>
