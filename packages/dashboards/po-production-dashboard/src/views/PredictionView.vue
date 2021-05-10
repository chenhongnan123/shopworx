<template>
  <div class="dashboard-body pa-5">
    <portal to="dashboard-title">
      QUALITY PREDICTION
    </portal>
    <div class="dashboard-main d-flex justify-space-between">
      <div class="dashboard-left">
        <div>
          <left-top v-if="reportdata" :reportdata="reportdata.reportdatacols[0]"/>
        </div>
        <div>
          <left-bottom v-if="reportdata" :reportdata="reportdata.reportdatacols[0]"/>
        </div>
      </div>
      <div class="dashboard-right">
        <right-top v-if="reportdata" :reportdata="reportdata"/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';
import LeftTop from '../components/prediction/LeftTop.vue';
import LeftBottom from '../components/prediction/LeftBottom.vue';
import RightTop from '../components/prediction/RightTop.vue';

export default {
  name: 'DashboardView',
  inject: ['theme'],
  data() {
    return {
    };
  },
  components: {
    LeftTop,
    LeftBottom,
    RightTop,
  },
  created() {
    // this.getReportDataDev(1);
    this.getReportData(1);
    this.timeInterval = setInterval(() => {
      this.getReportData(1);
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  computed: {
    ...mapState('poProductionDashboard', [
      'reportdata',
    ]),
  },
  methods: {
    ...mapActions('poProductionDashboard', [
      'getReportDataDev', 'getReportData',
    ]),
  },
};
</script>
<style scoped lang="scss">
.dashboard-body{
  background-color: #13253C;
  height: 100%;
  color: #fff;
  .dashboard-main{

  }
  .dashboard-left{
    width: 49.5%;
    height: 100%;
    >div:nth-child(2){
      margin-top: 1%;
    }
  }
  .dashboard-right{
    width: 49.5%;
  }
}
</style>
