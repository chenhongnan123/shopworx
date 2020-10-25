<template>
  <div style="height: 100%;">
    <report-view-loading v-if="loading" />
    <template v-else>
      <portal to="app-header">
        {{ $t(`reports.category.${title}`) }}
      </portal>
      <report-views-not-found v-if="!reportsFound" />
      <template v-else>
        <report-toolbar-extension @on-export="onExport" />
        <report-toolbar />
        <report-container :exportType="exportType" />
      </template>
    </template>
  </div>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapGetters,
  mapState,
} from 'vuex';
import ReportViewLoading from './ReportViewLoading.vue';
import ReportViewsNotFound from './ReportViewsNotFound.vue';
import ReportToolbarExtension from '../components/ReportToolbarExtension.vue';
import ReportToolbar from '../components/ReportToolbar.vue';
import ReportContainer from '../components/ReportContainer.vue';

export default {
  name: 'ReportViewer',
  components: {
    ReportViewLoading,
    ReportViewsNotFound,
    ReportToolbarExtension,
    ReportToolbar,
    ReportContainer,
  },
  data() {
    return {
      loading: false,
      exportType: null,
    };
  },
  created() {
    this.fetchReports();
  },
  watch: {
    $route() {
      this.fetchReports();
    },
  },
  computed: {
    ...mapState('reports', ['reportViews']),
    ...mapGetters('reports', ['activeReportCategory']),
    title() {
      return this.$route.query.id;
    },
    reportsFound() {
      return this.reportViews && this.reportViews.length;
    },
  },
  methods: {
    ...mapActions('reports', ['getReportViews']),
    ...mapMutations('helper', ['setExtendedHeader']),
    async fetchReports() {
      this.loading = true;
      const reportCategory = this.activeReportCategory(this.title);
      if (reportCategory) {
        await this.getReportViews(reportCategory.id);
        if (this.reportsFound) {
          this.setExtendedHeader(true);
        } else {
          this.setExtendedHeader(false);
        }
        this.loading = false;
      } else {
        const invalidPath = this.$route.fullPath;
        this.$router.push({ name: '404', params: { 0: invalidPath } });
      }
    },
    onExport(e) {
      this.exportType = e;
    },
  },
};
</script>

<style scoped>
.stick {
  position: -webkit-sticky;
  position: sticky;
  top: 104px;
  z-index: 1;
}
</style>
