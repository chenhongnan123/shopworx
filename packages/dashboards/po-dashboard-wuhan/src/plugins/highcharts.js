import Vue from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import HighchartsMore from 'highcharts/highcharts-more';
import solidGauge from 'highcharts/modules/solid-gauge';
// const count = document.documentElement.clientWidth/1920;
Highcharts.theme = {
  // colors: ['#0000ff','#D15FEE'],
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Poppins',
    },
    // marginRight:200*count
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    labels: {
      style: {
        color: '#fff',
        "font-size":15*count,
      },
      y:30*count

    }
  },
  yAxis: {
    labels: {
      style: {
        color: '#fff',
        "font-size":20*count,
      },
      y:10*count
    },
    
  },
  legend: {
    enabled: false,
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    itemStyle: {
      color: '#fff',
      // width:100*count,
      // fontSize:20*count,
      // padding:120*count,
      // transform:'translateY(-5px)'
    },
    // symbolPadding: 20*count,
    // x:-20*count
    // symbolHeight:30,
  },
  // tooltip: {
  //   shared: true,
  //   useHTML: true,
  //   headerFormat: '<small style="font-size:20px;">{point.key}</small><table  style="font-size:20px;">',
  //   pointFormat: '<tr><td style="color: {series.color};font-size:20px;">{series.name}: </td>' +
  //   '<td style="text-align: right;font-size:20px;"><b>{point.y}</b></td></tr>',
  //   footerFormat: '</table>',
  //   // style: {
  //   //   fontWeight: 'bold',
  //   //   fontSize:40,
  //   //   lineHeight:60
  //   // },
  //   padding:20
  // },
  plotOptions: {
    column: {
        dataLabels: {
            enabled: true,
            style:{
              fontSize:18*count,
              color:'#fff'
            }
        }
    }
  },
};

Highcharts.setOptions(Highcharts.theme);
HighchartsMore(Highcharts);
solidGauge(Highcharts);
Vue.use(HighchartsVue);
