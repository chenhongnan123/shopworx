<template>
  <div class="confidence-trend">
    <div class="sub-title">
      <span>{{'PRODUCTION & RESULT'}}</span>
      <div class="time-moudle-container"><TimeMoudle/></div>
    </div>
    <div style="padding-top:.1rem;">
      <Charts :chartsData = 'chartsData'/>
    </div>
  </div>
</template>

<script>
import TimeMoudle from './TimeMoudle';
import Charts from './Charts';
import {  mapState,mapMutations } from 'vuex';
export default {
  name: 'LineStatus',
  data(){
    return {
      chartsData:{
        xData:{
          categories: [],
          title: {
            style:{
              color:'#fff',
            },
            // text:'Tank',
          },
          labels: {
            style: {
              textOverflow: 'none',
            },
          },
        },
        yAxis: {
          // max: 100,
          // min: 0,
          // plotLines: [{
          //   value: 50,
          //   color: '#C02316',
          //   width: 2,
          //   zIndex:100,
          // },
          // {
          //   value: 75,
          //   color: '#FFA100',
          //   width: 2,
          //   zIndex:100,
          // }]
        },
        series: [],
      },
    }
  },
  components:{
    TimeMoudle,
    Charts
  },
  props: [ 'confidenceData' ],
  mounted(){
    this.handleChartsData(this.confidenceData);
  },
  methods:{
    handleChartsData(confidenceData){
      const confidencebyoperation = confidenceData.confidencebyoperation;
      const okpredictioncountlist = confidencebyoperation.filter(i => i.prediction === 1).map(i => i.predictioncount).sort((a, b) => a-b);
      const ngpredictioncountlist = confidencebyoperation.filter(i => i.prediction === -1).map(i => i.predictioncount).sort((a, b) => a-b);
      console.log(okpredictioncountlist, 'okpredictioncountlist');
      console.log(ngpredictioncountlist, 'ngpredictioncountlist');
      const categories = ['OK COUNT', 'NG COUNT'];
      const series = [okpredictioncountlist[0]||0,ngpredictioncountlist[ngpredictioncountlist.length-1]||0];
      const Op105Mobile = confidencebyoperation.filter(confidence => confidence.operationname === 'Op105Mobile');
      const Op106Mobile = confidencebyoperation.filter(confidence => confidence.operationname === 'Op106Mobile');
      const Op201Fixed = confidencebyoperation.filter(confidence => confidence.operationname === 'Op201Fixed');
      const Op201Mobile = confidencebyoperation.filter(confidence => confidence.operationname === 'Op201Mobile');
      const Op204Mobile = confidencebyoperation.filter(confidence => confidence.operationname === 'Op204Mobile');
      const Op203Mobile  = confidencebyoperation.filter(confidence => confidence.operationname === 'Op203Mobile');
      const Op202Fixed = confidencebyoperation.filter(confidence => confidence.operationname === 'Op202Fixed');
      const Op202Mobile  = confidencebyoperation.filter(confidence => confidence.operationname === 'Op202Mobile');
      if (Op105Mobile.length) {
        if (Op105Mobile.find(i => i.prediction === 1)) {
          series.push(Op105Mobile.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op105Mobile.find(i => i.prediction === -1)) {
          series.push(Op105Mobile.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op105Mobile OK', 'Op105Mobile NG');
      }
      if (Op106Mobile.length) {
        if (Op106Mobile.find(i => i.prediction === 1)) {
          series.push(Op106Mobile.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op106Mobile.find(i => i.prediction === -1)) {
          series.push(Op106Mobile.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op106Mobile OK', 'Op106Mobile NG');
      }
      if (Op201Mobile.length) {
        if (Op201Mobile.find(i => i.prediction === 1)) {
          series.push(Op201Mobile.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op201Mobile.find(i => i.prediction === -1)) {
          series.push(Op201Mobile.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op201Mobile OK', 'Op201Mobile NG');
      }
      if (Op201Fixed.length) {
        if (Op201Fixed.find(i => i.prediction === 1)) {
          series.push(Op201Fixed.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op201Fixed.find(i => i.prediction === -1)) {
          series.push(Op201Fixed.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op201Fixed OK', 'Op201Fixed NG');
      }
      if (Op202Mobile.length) {
        if (Op202Mobile.find(i => i.prediction === 1)) {
          series.push(Op202Mobile.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op202Mobile.find(i => i.prediction === -1)) {
          series.push(Op202Mobile.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op202Mobile OK', 'Op202Mobile NG');
      }
      if (Op202Fixed.length) {
        if (Op202Fixed.find(i => i.prediction === 1)) {
          series.push(Op202Fixed.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op202Fixed.find(i => i.prediction === -1)) {
          series.push(Op202Fixed.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op202Fixed OK', 'Op202Fixed NG');
      }
      if (Op203Mobile.length) {
        if (Op203Mobile.find(i => i.prediction === 1)) {
          series.push(Op203Mobile.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op203Mobile.find(i => i.prediction === -1)) {
          series.push(Op203Mobile.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op203Mobile OK', 'Op203Mobile NG');
      }
      if (Op204Mobile.length) {
        if (Op204Mobile.find(i => i.prediction === 1)) {
          series.push(Op204Mobile.find(i => i.prediction === 1).predictioncount);
        } else {
          series.push(0);
        }
        if (Op204Mobile.find(i => i.prediction === -1)) {
          series.push(Op204Mobile.find(i => i.prediction === -1).predictioncount);
        } else {
          series.push(0);
        }
        categories.push('Op204Mobile OK', 'Op204Mobile NG');
      }
      this.chartsData.xData.categories = categories;
      this.chartsData.series = [{
          name: 'OVERALL<br/>CONFIDENCE',
          type:'column',
          colorByPoint: true,
          data:series
          // data:overallconfidencearray.map((item, key) => {
          //   return {
          //     y: item,
          //     tlabel: confidenceData.tlabelarray[key],
          //     // endtime:this.getDateTime(endtimearray[key]),
          //   }
          // }),
        },
      ];
      // this.chartsData.yAxis.plotLines[0].value = confidenceData.badthresholdpercent;
      // this.chartsData.yAxis.plotLines[1].value = confidenceData.goodthresholdpercent;
    },
    getDateTime(dateNum){
      const dateObj = new Date(dateNum||new Date().getTime());
      return this.addZero(this.addZero(dateObj.getHours())+":"+this.addZero(dateObj.getMinutes())+":"+this.addZero(dateObj.getSeconds()));
    },
    addZero(num){
      return num.toString().length == 1 ? "0" + num : num;
    },
  },
  watch:{
    confidenceData:{
      handler(confidenceData){
        this.handleChartsData(confidenceData);
      },
      immediate: true,
      deep:true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .confidence-trend{
    background: #283B52;
    border-radius: .18rem;
    height: 100%;
    .sub-title{
      position: relative;
      .time-moudle-container{
        width:50%;
        height:100%;
        position:absolute;
        top:0;
        right:0;
        transform:scale(.9);
      }
    }
  }
</style>
