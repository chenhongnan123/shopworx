<template>
  <div class="dashboard-body pa-5">
    <portal to="dashboard-title">
      Overall Production Information
    </portal>
    <div class="dashboard-top d-flex justify-space-between">
      <div>
        <left-top v-if="reportdata" :reportdata="reportdata.reportdatacols[0]"/>
      </div>
      <div>
        <right-top v-if="reportdata" :reportdata="reportdata.reportdatacols[0]"/>
      </div>
    </div>
    <div class="dashboard-bottom mt-5">
      <view-bottom v-if="reportdata" :reportdata="reportdata.reportdatacols[0]"/>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';
import LeftTop from '../components/LeftTop.vue';
import RightTop from '../components/RightTop.vue';
import ViewBottom from '../components/ViewBottom.vue';

export default {
  name: 'DashboardView',
  inject: ['theme'],
  data() {
    return {
    };
  },
  components: {
    LeftTop,
    RightTop,
    ViewBottom,
  },
  created() {
    // this.getReportDataDev();
    this.getReportData();
    this.timeInterval = setInterval(() => {
      this.getReportData();
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
  .dashboard-top{
    width: 100%;
    height: 30%;
    >div{
      background: #283B52;
      border-radius: 18px;
      overflow: hidden;
    }
    >div:nth-child(1){
      width: 33%;
    }
    >div:nth-child(2){
      width: 66.5%;
    }
  }
  .dashboard-bottom{
    width: 100%;
    height: 68%;
  }
}
</style>
