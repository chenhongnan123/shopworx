<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0 px-2 font-weight-medium text-justify">
      <span>You asked:&nbsp;</span>
      <strong v-text="query.name"></strong>
    </v-card-text>
    <v-progress-linear indeterminate v-if="loading"></v-progress-linear>
    <v-card-text
      class="text-center"
      v-if="insightDetails
        && insightDetails.type
        && insightDetails.type.toUpperCase().includes('CHART')"
    >
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <highcharts :options="insightDetails.chartOptions"></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text
      class="text-justify"
      v-if="insightDetails
        && insightDetails.type
        && insightDetails.type.toUpperCase().includes('HTML')"
      >
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <div v-html="insightDetails.html"></div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InsightDetails',
  computed: {
    ...mapState('insight', ['query', 'window', 'loading', 'insightDetails']),
  },
};
</script>
