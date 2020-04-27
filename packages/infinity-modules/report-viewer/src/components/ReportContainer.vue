<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <report-chart></report-chart>
        <report-list></report-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ReportChart from './ReportChart.vue';
import ReportList from './ReportList.vue';

export default {
  name: 'ReportContainer',
  components: {
    ReportChart,
    ReportList,
  },
};
</script>
