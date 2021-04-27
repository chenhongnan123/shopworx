<template>
  <v-btn
    small
    color="primary"
    class="text-none"
    @click="saveReport"
    :loading="updating"
    v-if="!isBaseReport"
    :disabled="!saveEnabled"
  >
    {{ saveEnabled ? $t('save') : $t('saved') }}
  </v-btn>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'UpdateReport',
  data() {
    return {
      updating: false,
    };
  },
  computed: {
    ...mapState('reports', ['gridState', 'newReportTitle']),
    ...mapGetters('reports', ['isBaseReport', 'gridObject', 'reportTitle']),
    saveEnabled() {
      return this.gridState !== this.gridObject || this.newReportTitle !== this.reportTitle;
    },
  },
  methods: {
    ...mapActions('reports', ['updateReport']),
    async saveReport() {
      this.updating = true;
      await this.updateReport();
      this.updating = false;
    },
  },
};
</script>
