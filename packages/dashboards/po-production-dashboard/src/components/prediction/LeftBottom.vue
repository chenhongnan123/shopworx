<template>
  <div class='left-bottom'>
    <div class='sub-title'>
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
      <div class="hotplate-item" v-for="(item,k) in confidencebyhotplate" :key="k">
        <span class="text-center ml-5">{{item.operation}}</span>
        <i
        class="text-center ml-7"
        :style="{background:item.confidenceMobile ?
        (item.confidenceMobile === 1 ? '#55D802' : '#C02316') :
        '#666'}"
        >
          {{item.confidenceMobile ? (item.confidenceMobile === 1 ? 'OK' : 'NG') : 'N/A'}}
        </i>
        <i
        v-if = "item.operationNumber === '105'
        || item.operationNumber === '106'
        || item.operationNumber === '203'
        || item.operationNumber === '204'"
        class="text-center ml-10"
        >
          <span>N/A</span>
        </i>
        <i
        v-else
        class="text-center ml-10"
        :style="{background:item.confidenceFixed ?
        (item.confidenceFixed === 1 ? '#55D802' : '#C02316') :
        '#666'}"
        >
          {{item.confidenceFixed ? (item.confidenceFixed === 1 ? 'OK' : 'NG') : 'N/A'}}
        </i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftBottom',
  data() {
    return {
    };
  },
  props: ['reportdata'],
  watch: {
    reportdata: {
      handler(reportdata) {
        const confidencebyhotplate = [
          {
            operation: 'OP 105',
            operationNumber: '105',
          },
          {
            operation: 'OP 106',
            operationNumber: '106',
          },
          {
            operation: 'OP 201',
            operationNumber: '201',
          },
          {
            operation: 'OP 202',
            operationNumber: '202',
          },
          {
            operation: 'OP 203',
            operationNumber: '203',
          },
          {
            operation: 'OP 204',
            operationNumber: '204',
          },
        ];
        confidencebyhotplate.map((confidence) => {
          const j = { ...confidence };
          reportdata.confidencebyhotplate.forEach((item) => {
            if (item.operationtype.includes(j.operationNumber)) {
              if (item.operationtype.includes('fixed')) {
                if (!j.confidenceFixed) {
                  j.confidenceFixed = item.prediction;
                } else if (j.confidenceFixed === -1 || item.prediction === -1) {
                  j.confidenceFixed = -1;
                } else {
                  j.confidenceFixed = 1;
                }
              }
              if (item.operationtype.includes('mobile')) {
                if (!j.confidenceMobile) {
                  j.confidenceMobile = item.prediction;
                } else if (j.confidenceMobile === -1 || item.prediction === -1) {
                  j.confidenceMobile = -1;
                } else {
                  j.confidenceMobile = 1;
                }
              }
            }
          });
          return j;
        });
        this.confidencebyhotplate = confidencebyhotplate;
        console.log(confidencebyhotplate, 'obj');
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style scoped lang='scss'>
  .left-bottom{
    height: 49.5%;
    background: #283B52;
    border-radius: 18px;
    overflow: hidden;
    padding-bottom: 1vh;
    .sub-title{
      height: 4vh;
      font-size: 2vh;
      line-height: 4vh;
      background-color: #245692;
      padding: 0 2vh;
    }
    >.row{
      >.col{
        >p{
          font-size: 2vh;
          line-height: 3vh;
          opacity: .7;
        }
      }
    }
    .hotplate-item{
      display: inline-block;
      font-size: 3vh;
      line-height: 4vh;
      margin-top: 1vh;
      overflow: hidden;
      i{
        display: inline-block;
        width: 10vh;
        height: 10vh;
        line-height: 10vh;
        font-size: 2.5vh;
        border-radius: 50%;
        border: 2px solid #fff;
        font-style: normal;
      }
    }
    .hotplate-item:nth-of-type(n){
      margin-left: 1vw;
    }
    .hotplate-item:nth-of-type(2n){
      margin-left: 3vw;
    }
  }
</style>
