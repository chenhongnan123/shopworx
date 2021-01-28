import Vue from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import HighchartsMore from 'highcharts/highcharts-more';
import xRange from 'highcharts/modules/xrange';
import pareto from 'highcharts/modules/pareto';

Highcharts.theme = {
  chart: {
    backgroundColor: null,
    style: {
      fontFamily: 'Poppins',
    },
  },
  credits: {
    enabled: false,
  },
};

Highcharts.setOptions(Highcharts.theme);
HighchartsMore(Highcharts);
xRange(Highcharts);
pareto(Highcharts);
Vue.use(HighchartsVue);
