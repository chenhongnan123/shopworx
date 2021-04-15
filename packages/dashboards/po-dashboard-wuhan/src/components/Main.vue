<template>
  <div class="main pa-4">
    <v-row class="pb-2" style="height:3.5rem">
      <v-col cols="4" class="pr-2">
        <Confidence v-if="dashboardData" :confidenceData="dashboardData.reportdatacols[0]"/>
      </v-col>
      <v-col cols="8">
        <ConfidenceTrend v-if="dashboardData" :confidenceData="dashboardData.reportdatacols[0]"/>
      </v-col>
    </v-row>
    <v-row  style="height:5.5rem">
      <!-- <v-col cols="4" class="pr-2"> -->
        <!-- <FIixedHotplate v-if="dashboardData" :confidenceData="dashboardData.reportdatacols[0]"/> -->
        <!-- <ConfidenceHistory v-if="dashboardData" :confidenceData="dashboardData"/> -->
      <!-- </v-col> -->
      <v-col cols="12">
        <!-- <ConfidenceHistory v-if="dashboardData" :confidenceData="dashboardData"/> -->
        <OpCharts v-if="dashboardData" :confidenceData="dashboardData.reportdatacols[0]"/>
      </v-col>
    </v-row>
    <div class="alarm mt-3" v-if="dashboardData">
      {{dashboardData.reportdatacols[0].alert}}
    </div>
  </div>
</template>

<script>
import Confidence from './Confidence';
import ConfidenceTrend from './ConfidenceTrend';
import FIixedHotplate from './FIixedHotplate';
import ConfidenceHistory from './ConfidenceHistory';
import OpCharts from './OpCharts';

import {  mapState, mapMutations ,mapActions } from 'vuex';

export default {
  name: 'mainmoudle',
  data(){
    return {
    }
  },
  components: {
    Confidence,
    ConfidenceTrend,
    FIixedHotplate,
    ConfidenceHistory,
    OpCharts
  },
  mounted(){
  },
  computed:{
    ...mapState({
      dashboardData: state => state.dashboard.dashboardData,
    }),
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

  .main{
    height:100%;
    position:relative;
    color: #fff;
    >.row{
      height: 4.5rem;
      .col{
        height: 100%;
      }
    }
    .alarm{
      height: .6rem;
      text-align: center;
      color: red;
      line-height: .6rem;
      font-size: .3rem;
      background: #283B52;
      border-radius: .08rem;
    }
  }
  
    
</style>
