<template>
  <div class='left-top'>
    <div class='sub-title'>
      <span>PRODUCTION INFORMATION</span>
    </div>
    <v-row class="px-5" no-gutters>
      <v-col cols='6'>
        <div class='mt-1'>Line Name</div>
        <h3>SX11</h3>
        <div class='mt-2'>Product Type</div>
        <h3>SX11</h3>
        <div class='mt-2'>{{'Output'}}</div>
        <h3>{{okCount+ngCount}}</h3>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols='5' class="d-flex flex-column align-center">
        <p class='mt-1 mb-5' style='text-indent:.3em;'>Prediction Rate</p>
        <v-progress-circular
          :rotate='-90'
          :size='150'
          :width='20'
          :value='okCount/(okCount+ngCount)*100'
          color="#55D802"
        >
          <div style='color:#fff;font-weight:700;'>
            {{okCount/(okCount+ngCount)*100}}%
          </div>
        </v-progress-circular>
        <p class="mt-2">{{reportdata.tlabel}}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'LeftTop',
  data() {
    return {
      okCount: 0,
      ngCount: 0,
    };
  },
  props: ['reportdata'],
  watch: {
    reportdata: {
      handler(reportdata) {
        const { confidencebyoperation } = reportdata;
        const okCount = confidencebyoperation
          .filter((i) => i.prediction === 1)
          .map((i) => i.predictioncount).sort((a, b) => a - b)[0];
        const ngCount = confidencebyoperation
          .filter((i) => i.prediction === -1)
          .map((i) => i.predictioncount).sort((a, b) => b - a)[0];
        this.okCount = okCount || 0;
        this.ngCount = ngCount || 0;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style scoped lang='scss'>
  .left-top{
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
        p{
          font-size: 2.3vh;
          line-height: 3vh;
        }
      }
    }
  }
</style>
