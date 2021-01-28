<template>
  <portal to="app-extension">
    <div>
      <update-report />
      <save-report-as />
      <report-view-list />
      <export-report @on-export="onExport" />
    </div>
  </portal>
</template>

<script>
import UpdateReport from './toolbar/UpdateReport.vue';
import SaveReportAs from './toolbar/SaveReportAs.vue';
import ReportViewList from './toolbar/ReportViewList.vue';
import ExportReport from './toolbar/ExportReport.vue';

export default {
  name: 'ReportToolbarExtension',
  components: {
    UpdateReport,
    SaveReportAs,
    ReportViewList,
    ExportReport,
  },
  methods: {
    onExport(e) {
      this.$emit('on-export', e);
    },
  },
};
</script>
