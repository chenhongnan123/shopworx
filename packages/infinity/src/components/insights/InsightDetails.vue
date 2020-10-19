<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0 px-2 font-weight-medium text-justify">
      <span>You asked:&nbsp;</span>
      <span v-text="query.name"></span>
    </v-card-text>
    <v-progress-linear :indeterminate="!loading"></v-progress-linear>
    <v-card-text class="text-center">
      <v-row align="center" no-gutters style="height: 100%">
        <v-col cols="12">
          <highcharts
            v-if="Object.keys(this.report).length"
            :options="this.report.options"
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
    ...mapState('report', ['loading']),
  },
  async created() {
    const payload = {
      start: 20201015,
      end: 20201015,
      siteid: 198,
    };
    const executeReport = await this.executeReport({
      reportName: this.query.reportName,
      payload,
    });
    this.report = JSON.parse(executeReport);
  },
  data() {
    return {
      report: [],
    };
  },
  methods: {
    ...mapActions('report', ['executeReport']),
  },
};
</script>
