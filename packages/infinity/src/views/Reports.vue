<template>
  <div>
    <report-toolbar
      :title="id"
      :loading="loading"
    />
    <v-expand-transition>
      <report-chart
        :loading="loading"
        style="height: 300px"
        v-show="selectedChart !== null"
      />
    </v-expand-transition>
    <report-grid
      :loading="loading"
      style="min-height: calc(100vh - 444px)"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ReportToolbar from '@/components/reports/ReportToolbar.vue';
import ReportChart from '@/components/reports/ReportChart.vue';
import ReportGrid from '@/components/reports/ReportGrid.vue';

export default {
  name: 'Reports',
  components: {
    ReportToolbar,
    ReportChart,
    ReportGrid,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('report', ['selectedChart']),
  },
  created() {
    this.fetchReportData();
  },
  watch: {
    id() {
      this.fetchReportData();
    },
  },
  methods: {
    ...mapActions('report', ['getReportFilters', 'executeReport']),
    async fetchReportData() {
      this.loading = true;
      try {
        const data = await this.getReportFilters(this.id);
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          const resp = await this.executeReport(this.id);
          if (resp && resp.errors) {
            this.$root.$snackbar.error(resp.errors);
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
  },
};
</script>
