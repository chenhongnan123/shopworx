<template>
  <div class="fixed-hotplate text-center">
    <div class="sub-title text-left">
      <span>DETAILS HOTPLATE</span>
    </div>
    <img src="../assets/tank.png" style="height:90%;"/>
    <div v-for="op in confidencebyhotplate" :key="op.operation" class="op-sign d-flex" :style="{left:op.left,top:op.top}">
      <span>{{op.operation}}</span>
      <i :style="{background:op.confidenceMobile === 1 ? '#55D802' : '#C02316'}">Mobile</i>
      <i v-if="op.operationNumber !== '303'" :style="{background:op.confidenceFixed === 1 ? '#55D802' : '#C02316'}">Fixed</i>
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
            operationNumber: '201',
            left: '57%',
            top: '46%'
          },
          {
            operation: 'OP 301',
            operationNumber: '301',
            left: '49%',
            top: '10%'
          },
          // {
          //   operation: 'OP 202',
          //   operationNumber: '202'
          // },
          // {
          //   operation: 'OP 302',
          //   operationNumber: '302'
          // },
          {
            operation: 'OP 203',
            operationNumber: '203',
            left: '22%',
            top: '72%'
          },
          {
            operation: 'OP 303',
            operationNumber: '303',
            left: '17%',
            top: '50%'
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
    position: relative;
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
    .op-sign{
      line-height: .7rem;
      position: absolute;
      i{
        display: inline-block;
        width: .7rem;
        height: .7rem;
        font-size: .2rem;
        border-radius: 50%;
        border: .01rem solid #fff;
        margin-left: .1rem;
      }
    }
  }
</style>
