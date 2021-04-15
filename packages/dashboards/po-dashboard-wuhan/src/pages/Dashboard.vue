<template>
  <div class="charts">
    <Main/>
  </div>
</template>

<script>
import Main from '@/components/Main';
import {  mapState ,mapActions } from 'vuex';
export default {
  name: 'charts',
  components:{
    Main
  },
  async created() {
    this.getDashboardData();
    setInterval(() => {
      window.location.reload();
      this.getChartsDataF2({startdate,enddate,tlabel});
      // this.getChartsDataF3({startdate,enddate,tlabel});
    }, 60000);
  },
  computed:{
    ...mapState({
      dashboardData: state => state.dashboard.dashboardData,
    }),
  },
  methods: {
    ...mapActions({
      getDashboardData: 'dashboard/GET_SESSION_ID',
      getChartsDataF2: 'dashboard/GET_CHARTSDATAF2',
      // getDashboardData: 'dashboard/GET_DASHBOARDDATA',
      // getChartsDataF3: 'dashboard/GET_CHARTSDATAF3',
    })
  }
}
</script>

<style scoped lang="scss">
  .charts{
    height:100%;
    background-color: #13253C;
  }
</style>
