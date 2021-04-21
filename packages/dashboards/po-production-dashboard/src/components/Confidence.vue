<template>
  <div class='confidence'>
      <p class='sub-title'>
        <span>PRODUCTION INFORMATION</span>
      </p>
      <v-row style='padding:.12rem 0 0 .16rem;'>
        <v-spacer></v-spacer>
        <v-col cols='6'>
          <p class='mt-1'>Line Name</p>
          <h3>{{'SX11'}}</h3>
          <p class='mt-1'>Product Type</p>
          <h3>{{'SX11'}}</h3>
          <p class='mt-1'>{{'Output'}}</p>
          <h3>{{okCount+ngCount}}</h3>
        </v-col>
        <v-col cols='5'>
          <p class='mt-1 mb-5' style='text-indent:.3em;'>Prediction Rate</p>
          <v-progress-circular
            :rotate='-90'
            :size='150'
            :width='20'
            :value='okCount/(okCount+ngCount)*100'
            :color="'#55D802'"
          >
            <div style='width:2rem;color:#fff;font-size:.3rem;word-wrap: break-word;text-align:
              center;line-height: .4rem;font-weight:700;'>
              <span>{{(okCount/(okCount+ngCount)*100).toFixed(2)}}%</span>
            </div>
          </v-progress-circular>
        </v-col>
      </v-row>
  </div>
</template>

<script>
export default {
  name: 'confidence',
  data() {
    return {
      // confidenceStatus: '',
      // confidenceColor: '',
      okCount: 0,
      ngCount: 0,
    };
  },
  props: ['confidenceData'],
  computed: {
    startTime() {
      const dateObj = new Date(this.confidenceData.starttime || new Date().getTime());
      return this.addZero(this.addZero(dateObj.getFullYear()) + '-' + this.addZero(dateObj.getMonth() + 1) + '-' + dateObj.getDate()) + ' ' + ' ' + this.addZero(dateObj.getHours()) + ':' + this.addZero(dateObj.getMinutes()) + ':' + this.addZero(dateObj.getSeconds());
    },
    endTime() {
      const dateObj = new Date(this.confidenceData.endtime || new Date().getTime());
      return this.addZero(this.addZero(dateObj.getFullYear()) + '-' + this.addZero(dateObj.getMonth() + 1) + '-' + dateObj.getDate()) + ' ' + ' ' + this.addZero(dateObj.getHours()) + ':' + this.addZero(dateObj.getMinutes()) + ':' + this.addZero(dateObj.getSeconds());
    },
  },
  methods: {
    addZero(num) {
      return num.toString().length === 1 ? '0' + num : num;
    },
  },
  watch: {
    confidenceData: {
      handler(confidenceData) {
        // console.log(confidenceData, 'confidenceData');
        // let confidenceStatus = null;
        // const colorArr = ['#C02316', '#FFA100', '#55D802'];
        // if (confidenceData.overallconfidence <= 50) {
        //   confidenceStatus = 0;
        // } else if (confidenceData.overallconfidence > confidenceData.badthresholdpercent &&
        // confidenceData.overallconfidence <= confidenceData.goodthresholdpercent) {
        //   confidenceStatus = 1;
        // } else {
        //   confidenceStatus = 2;
        // }
        // this.confidenceColor = colorArr[confidenceStatus];
        const confidencebyoperation = confidenceData.confidencebyoperation;
        const okCount = confidencebyoperation.filter((i) => i.prediction === 1)
          .map((i) => i.predictioncount).sort((a, b) => a - b)[0];
        const ngCount = confidencebyoperation.filter((i) => i.prediction === -1)
          .map((i) => i.predictioncount).sort((a, b) => b - a)[0];
        console.log(okCount, ngCount);
        this.okCount = okCount || 0;
        this.ngCount = ngCount || 0;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  .confidence{
    background: #283B52;
    border-radius: .18rem;
    height: 100%;
    >p{
      height: .44rem;
      border-radius: .08rem;
      font-size: .2rem;
      line-height: .44rem;
    }
    >.row{
      >.col{
        p{
          font-size: .24rem;
          line-height: .3rem;
          opacity: 0.7;
          margin-bottom: .1rem;
        }
        >h3{
          font-size: .28rem;
          line-height: .5rem!important;
          // margin-bottom: .3rem;
        }
      }
    }
  }
</style>
