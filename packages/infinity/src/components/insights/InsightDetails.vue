<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0 px-2 font-weight-medium text-justify">
      <span>You asked:&nbsp;</span>
      <span v-text="query.name"></span>
    </v-card-text>
    <v-progress-linear :indeterminate="true"></v-progress-linear>
    <v-card-text class="text-center" v-if="Object.keys(report).length">
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <highcharts
            :options="report.options"
          ></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'InsightDetails',
  computed: {
    ...mapState('insight', ['query', 'window']),
    ...mapState('report', ['report']),
  },
  methods: {
    ...mapActions('report', ['executeReport']),
  },
};
</script>
