<template>
  <div class='right-top'>
    <div class='sub-title'>
      <span>RESULT DETAILS</span>
    </div>
    <div class="pa-2">
      <v-row class="table-header text-center">
        <v-col cols="5"><span>T-LABEL</span></v-col>
        <v-col cols="3"><span>TIME</span></v-col>
        <v-col cols="4"><span>RESULT</span></v-col>
      </v-row>
      <v-row v-for="(item,key) in reportdata.reportdatacolsdetails" :key="key"
      class="table-body text-center">
        <v-col cols="5"><span>{{item.tlabel}}</span></v-col>
        <v-col cols="3"><span>{{moment(item.endtime - 3600000).format('HH:mm:ss')}}</span></v-col>
        <v-col cols="4">
          <i
          :style="{background:item.overallprediction === 1 ? '#55D802' : '#C02316'}"
          >
          </i>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'RightTop',
  data() {
    return {
      moment,
      reportdatacolsdetails: [],
    };
  },
  props: ['reportdata'],
  watch: {
    reportdata: {
      handler(reportdata) {
        const reportdatacolsdetails = [...reportdata.reportdatacolsdetails];
        this.reportdatacolsdetails = reportdatacolsdetails.reverse();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style scoped lang='scss'>
  .right-top{
    height: 100%;
    background: #283B52;
    border-radius: 18px;
    overflow: hidden;
    .sub-title{
      height: 4vh;
      font-size: 2vh;
      line-height: 4vh;
      background-color: #245692;
      padding: 0 2vh;
    }
    .table-header{
      span{
        font-size: 3vh;
        line-height: 4vh;
        opacity: .7;
      }
    }
    .table-body{
      span{
        font-size: 3vh;
        line-height: 8vh;
        vertical-align: middle;
      }
      i{
        display: inline-block;
        width: 7vh;
        height: 7vh;
        border-radius: 50%;
        border: 2px solid #fff;
        vertical-align: middle;
      }
    }
  }
</style>
