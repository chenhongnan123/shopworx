<template>
  <div class="charts" :style="{width: '100%', height: '100%'}">
    <div :style="{width: '100%', height: '100%'}" v-if="show">
        <highcharts :options="data" theme="dark"></highcharts>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Charts',
  data(){
    return {
      show:true,
      data:{
        colors: ['#55D802', '#C02316'],
        chart: {
          type: 'column',
          height:'24%',
        },
        title: {
          text: '',
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          labels: {
            rotation: 90
          }
        },
        yAxis: {
          title: {
            style:{
              color:'#fff',
            },
            // text:'Confidence[%]',
            text:'',
          },
          gridLineColor: 'rgba(255,255,255,.1)'
        },
        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat: '<small style="font-size:20px;">{point.key}</small><table  style="font-size:20px;">',
          pointFormat: '<tr><td style="color: {series.color};font-size:20px;">OVERALL CONFIDENCE: </td>' +
          '<td style="text-align: right;font-size:20px;"><b>{point.y}</b></td></tr>' +
          '<tr><td style="color: {series.color};font-size:20px;">TLABEL: </td>' +
          '<td style="text-align: right;font-size:20px;"><b>{point.tlabel}</b></td></tr>' + 
          '<tr><td style="color: {series.color};font-size:20px;">ENDTIME: </td>' +
          '<td style="text-align: right;font-size:20px;"><b>{point.endtime}</b></td></tr>',
          footerFormat: '</table>',
          // style: {
          //   fontWeight: 'bold',
          //   fontSize:40,
          //   lineHeight:60
          // },
          padding:20
        },
      }
    }
  },
  props:{
    chartsData:{
      type:Object,
      required:false
    },
    index:{
      type:Number,
      required:false
    },
  },
  components:{
  },
  watch:{
    chartsData:{
      handler(newVal,oldVal){
        this.show = true;
        this.data.xAxis = newVal.xData;
        this.data.yAxis = {
          ...this.data.yAxis,
          ...newVal.yAxis
        }
        this.data.series = newVal.series;
        this.data.chart = {
          ...this.data.chart,
          ...newVal.chart,
        }
      },
      deep:true,
      immediate: true,
    }
    
  },
  computed:{
  }
}
</script>

<style scoped lang="scss">
</style>
