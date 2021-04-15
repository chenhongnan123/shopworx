<template>
  <div class="fixed-hotplate">
    <div class="sub-title">
      <span>DETAILS HOTPLATE</span>
    </div>
    <v-row justify="space-between" style="padding:.12rem 0 0 .16rem;" class="text-center">
      <v-col cols="2"></v-col>
      <v-col cols="2"><p>MOBILE</p></v-col>
      <v-col cols="2"><p>FIXED</p></v-col>
      <v-col cols="2"></v-col>
      <v-col cols="2"><p>MOBILE</p></v-col>
      <v-col cols="2"><p>FIXED</p></v-col>
    </v-row>
    <div class="d-flex flex-wrap">
      <div class="hotplate-item" v-for="item in confidencebyhotplate" :key="item.operationNumber">
        <span class="text-center ml-5">{{item.operation}}</span>
        <i  
        v-if = "item.operationNumber === '202' || item.operationNumber === '302'"
        class="text-center ml-7" 
        >
          <span style="opacity: 0">{{'N/A'}}</span>
        </i>
        <i  
        v-else
        class="text-center ml-7" 
        :style="{background:item.confidenceMobile === 1 ? '#55D802' : '#C02316'}"
        >
          <span style="opacity: 0">{{Math.round(item.confidenceMobile)}}</span>
        </i>
        <i  
        v-if = "item.operationNumber === '202' || item.operationNumber === '302' || item.operationNumber === '303'"
        class="text-center ml-10" 
        >
          <span :style="{color:item.operationNumber === '303' ? '#283B52' : '#ff' }"><span style="opacity: 0">{{'N/A'}}</span></span>
        </i>
        <i 
        v-else
        class="text-center ml-10"
        :style="{background:item.confidenceFixed === 1 ? '#55D802' : '#C02316'}"
        >
          <span style="opacity: 0">{{Math.round(item.confidenceFixed)}}</span>
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import TimeMoudle from './TimeMoudle';
import {  mapState,mapMutations } from 'vuex';
export default {
  name: 'FIixedHotplate',
  data(){
    return {
      confidencebyhotplate:[]
    }
  },
  props: [ 'confidenceData' ],
  watch: {
    confidenceData: {
      handler(confidenceData) {
        console.log(confidenceData.confidencebyhotplate, 'confidencebyhotplate');
        const confidencebyhotplate = [
          {
            operation: 'OP 201',
            operationNumber: '201'
          },
          {
            operation: 'OP 301',
            operationNumber: '301'
          },
          {
            operation: 'OP 202',
            operationNumber: '202'
          },
          {
            operation: 'OP 302',
            operationNumber: '302'
          },
          {
            operation: 'OP 203',
            operationNumber: '203'
          },
          {
            operation: 'OP 303',
            operationNumber: '303'
          },
        ];
        confidencebyhotplate.forEach(j => {
          confidenceData.confidencebyhotplate.forEach(item => {
            if (item.operationtype.includes(j.operationNumber)) {
              if (item.operationtype.includes('Fixed')) {
                j['confidenceFixed'] = item.prediction;
              }
              if (item.operationtype.includes('Mobile')) {
                j['confidenceMobile'] = item.prediction;
              }
            }
          });
        });
        this.confidencebyhotplate = confidencebyhotplate;
        console.log(confidencebyhotplate, 'obj');
      },
      deep: true,
      immediate: true
    }
  },
}
</script>

<style scoped lang="scss">
  .fixed-hotplate{
    background: #283B52;
    border-radius: .18rem;
    height: 100%;
    .sub-title{
      position: relative;
    }
    >.row{
      >.col{
        >p{
          font-size: .24rem;
          line-height: .21rem;
          opacity: .7;
          margin-bottom: .1rem;
        }
      }
    }
    .hotplate-item{
      display: inline-block;
      font-size: .4rem;
      line-height: 1rem;
      margin-top: .13rem;
      i{
        display: inline-block;
        width: 1rem;
        height: 1rem;
        font-size: .3rem;
        border-radius: 50%;
        border: .01rem solid #fff;
      }
    }
  }
</style>
