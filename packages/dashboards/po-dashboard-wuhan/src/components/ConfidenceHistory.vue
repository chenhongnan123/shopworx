<template>
  <div class="confidence-history">
    <div class="sub-title">
      <span>{{'TILE HEADING'}}</span>
    </div>
    <div class="pa-2">
      <v-row class="table-header text-center">
        <v-col cols="6"><span>T-LABEL</span></v-col>
        <v-col cols="4"><span>TIME</span></v-col>
        <v-col cols="2"><span>RESULT</span></v-col>
      </v-row>
      <v-row v-for="(item,key) in confidenceData.reportdatacolsdetails" :key="key" :class="['table-body','text-center',key===0 ? 'first' : '']">
        <v-col cols="6"><span>{{item.tlabel}}</span></v-col>
        <v-col cols="4"><span>{{getEndTime(item.endtime)}}</span></v-col>
        <v-col cols="2">
          <!-- <span style="opacity: 0">{{}}%</span> -->
          <!-- <i 
          :style="{background:item.overallconfidence < confidenceData.reportdatacols[0].badthresholdpercent ? '#C02316' : ((item.overallconfidence > confidenceData.reportdatacols[0].goodthresholdpercent) ? '#55D802' : '#FFA100')}"
          >
          </i> -->
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
import TimeMoudle from './TimeMoudle';
import {  mapState,mapMutations } from 'vuex';
export default {
  name: 'ConfidenceHistory',
  props: [ 'confidenceData' ],
  data() {
    return {
      confidenceColor: '',
      reportdatacolsdetails: [],
    }
  },
  methods: {
    getEndTime(time){
      const dateObj = new Date(time||new Date().getTime());
      return this.addZero(this.addZero(dateObj.getHours())+":"+this.addZero(dateObj.getMinutes())+":"+this.addZero(dateObj.getSeconds()));
    },
    addZero(num){
      return num.toString().length == 1 ? "0" + num : num;
    },
  },
  watch: {
    confidenceData: {
      handler(confidenceData) {
        const reportdatacolsdetails = [...confidenceData.reportdatacolsdetails];
        this.reportdatacolsdetails = reportdatacolsdetails.reverse();
      },
      deep: true,
      immediate: true
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .confidence-history{
    background: #283B52;
    border-radius: .18rem;
    height: 100%;
    .sub-title{
      position: relative;
    }
    .table-header{
      span{
        font-size: .24rem;
        line-height: .4rem;
        opacity: .7;
        margin-bottom: .1rem;
      }
    }
    .table-body{
      span{
        // display: inline-block;
        font-size: .25rem;
        line-height: .6rem;
        margin-bottom: .1rem;
        width: 1rem;
        vertical-align: middle;
      }
      i{
        display: inline-block;
        width: .4rem;
        height: .4rem;
        border-radius: 50%;
        border: .01rem solid #fff;
        vertical-align: middle;
        margin-top: .1rem;
      }
    }
    .first{
      span{
        font-weight: 700!important;
        font-size: .27rem;
        color: #ffe;
      }
    }
    >.row{
      >.col{
        >p{
          font-size: .3rem;
          line-height: .4rem;
          opacity: .7;
        }
        >h3{
          font-size: .28rem;
          line-height: .32rem!important;
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>
