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
import { mapState, mapActions } from 'vuex';
import ReportChart from './ReportChart.vue';
import ReportList from './ReportList.vue';

export default {
  name: 'ReportContainer',
  components: {
    ReportChart,
    ReportList,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('reports', ['reportMapping', 'dateRange']),
  },
  watch: {
    reportMapping(val) {
      if (val) {
        this.runReport();
      }
    },
    dateRange() {
      this.runReport();
    },
  },
  methods: {
    ...mapActions('reports', ['executeReport']),
    async runReport() {
      this.loading = true;
      await this.executeReport();
      this.loading = false;
    },
  },
};
</script>
