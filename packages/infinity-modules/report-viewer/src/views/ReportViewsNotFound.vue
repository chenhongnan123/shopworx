<template>
  <v-container fill-height>
    <v-row
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndDown"
    >
      <v-col cols="5" align="center">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${reportViewerIllustration}.svg`)"
          contain
        />
      </v-col>
      <v-col cols="12" align="center">
        <span class="headline">
          {{ $t('noReports') }}
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ReportViewsNotFound',
  computed: {
    reportViewerIllustration() {
      return this.$vuetify.theme.dark
        ? 'report-viewer-dark'
        : 'report-viewer-light';
    },
  },
};
</script>
