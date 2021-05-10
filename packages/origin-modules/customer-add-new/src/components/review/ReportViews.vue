<template>
  <v-card flat>
    <v-card-text class="ml-4">
      <v-row no-gutters>
        <v-col cols="12">
          <v-progress-linear
            :value="(completed/reportViews.length)*100"
            height="25"
          >
            <strong class="white--text">{{completed}}/{{reportViews.length}}</strong>
          </v-progress-linear>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import reportViews from '../../data/reportviewsPayload';

export default {
  name: 'Reports',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      completed: 0,
      reportViews,
    };
  },
  created() {
    if (this.complete) {
      this.completed = this.reportViews.length;
    }
  },
  methods: {
    ...mapActions('newCustomer', [
      'addReportView',
      'addReportViewMapping',
      'getReports',
      'getReportCategories',
    ]),
  },
  watch: {
    async loading(val) {
      if (val) {
        const reports = await this.getReports();
        const reportCategories = await this.getReportCategories();
        if (reports && reports.length) {
          const created = [];
          for (let i = 0; i < this.reportViews.length; i += 1) {
            const { reportView, reportViewMapping } = this.reportViews[i];
            const { reportNames } = reportViewMapping;
            const reportsCategoryId = reportCategories
              .find((r) => r.reportsCategoryName === reportView.reportsCategoryName)
              .id;
            const reportId = reports
              .find((r) => r.reportName === reportView.reportName)
              .id;
            delete reportView.reportsCategoryName;
            delete reportView.reportName;
            // eslint-disable-next-line
            const addedReportView = await this.addReportView({
              ...reportView,
              reportsCategoryId,
              reportId,
            });
            if (addedReportView) {
              let reportIds = [];
              for (let j = 0; j < reportNames.length; j += 1) {
                const reportName = reportNames[j];
                const { id } = reports.find((r) => r.reportName === reportName);
                reportIds = [...reportIds, id];
              }
              // eslint-disable-next-line
              const addedReportViewMapping = await this.addReportViewMapping({
                reportViewId: addedReportView,
                reportIds,
              });
              if (addedReportViewMapping) {
                this.completed += 1;
              }
              created.push(addedReportViewMapping);
            }
          }
          if (created.every((c) => c === true)) {
            this.$emit('on-complete');
          }
        }
      }
    },
  },
};
</script>
