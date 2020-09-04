<template>
  <portal to="app-extension">
    <div>
      <update-report />
      <save-report-as />
      <report-view-list />
      <v-btn small disabled outlined color="primary" class="text-none ml-2">
        <v-icon small left>mdi-cloud-download-outline</v-icon>
        Export
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </div>
  </portal>
</template>

<script>
import UpdateReport from './toolbar/UpdateReport.vue';
import SaveReportAs from './toolbar/SaveReportAs.vue';
import ReportViewList from './toolbar/ReportViewList.vue';

export default {
  name: 'ReportToolbarExtension',
  components: {
    UpdateReport,
    SaveReportAs,
    ReportViewList,
  },
};
</script>
