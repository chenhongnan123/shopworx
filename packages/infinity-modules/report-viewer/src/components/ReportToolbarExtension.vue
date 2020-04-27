<template>
  <portal to="app-extension">
    <div>
      <v-btn
        small
        v-if="!isBaseReport"
        color="primary"
        class="text-none"
        :disabled="!saveEnabled"
      >
        {{ saveEnabled ? 'Save' : 'Saved' }}
      </v-btn>
      <save-report-as />
      <report-view-list />
    </div>
  </portal>
</template>

<script>
import { mapGetters } from 'vuex';
import SaveReportAs from '../components/toolbar/SaveReportAs.vue';
import ReportViewList from '../components/toolbar/ReportViewList.vue';

export default {
  name: 'ReportToolbarExtension',
  components: {
    SaveReportAs,
    ReportViewList,
  },
  computed: {
    ...mapGetters('reports', ['isBaseReport']),
  },
};
</script>
