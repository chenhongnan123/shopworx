<template>
  <div class='left-top'>
    <div class='sub-title'>
      <span>DETAIL RESULT</span>
    </div>
    <v-row class="px-5" no-gutters>
      <v-col cols='6' class="d-flex flex-column align-center justify-content-center pt-4">
        <div class="cycle-status">{{reportdata.confidencebyhotplate
                                    .filter(item=>item.prediction === -1).length === 0 ?
                                    'OK' : 'NG'}}</div>
        <span>{{reportdata.tlabel}}</span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols='4'>
        <div class='mt-1'>NG Module</div>
        <h3>{{reportdata.confidencebyhotplate
              .filter(item=>item.prediction === -1).length === 0 ?
              '-' :
              reportdata.confidencebyhotplate
              .filter(item=>item.prediction === -1)[0].operationtype}}
        </h3>
        <div class='mt-2'>NG Reason</div>
        <h3>{{reportdata.confidencebyhotplate
              .filter(item=>item.prediction === -1).length === 0 ?
              '-' : 'Overheating'}}</h3>
        <div class='mt-2'>Time</div>
        <h3>{{moment(reportdata.endtime - 3600000).format('YYYY-MM-DD HH:mm:ss')}}</h3>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'LeftTop',
  data() {
    return {
      moment,
      confidenceStatus: '',
      confidenceColor: '',
    };
  },
  props: ['reportdata'],
  watch: {
    reportdata: {
      handler(reportdata) {
        let confidenceStatus = null;
        const colorArr = ['#C02316', '#FFA100', '#55D802'];
        if (reportdata.overallconfidence <= 50) {
          confidenceStatus = 0;
        } else if (reportdata.overallconfidence > reportdata.badthresholdpercent
        && reportdata.overallconfidence <= reportdata.goodthresholdpercent) {
          confidenceStatus = 1;
        } else {
          confidenceStatus = 2;
        }
        this.confidenceColor = colorArr[confidenceStatus];
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style scoped lang='scss'>
  .left-top{
    height: 49.5%;
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
    >.row{
      >.col{
        div{
          font-size: 3vh;
          line-height: 6vh;
          opacity: 0.7;
        }
        >h3{
          font-size: 2.5vh;
          line-height: 7vh;
        }
        .cycle-status{
          color: #fff;
          text-align: center;
          line-height: 15vw;
          font-size: 9vh;
          background: rgb(85, 216, 2);
          width: 15vw;
          height: 15vw;
          border-radius: 50%;
        }
        >span{
          font-size: 3.5vh;
          opacity: .7;
          margin-top: 2vh;
        }
      }
    }
  }
</style>
