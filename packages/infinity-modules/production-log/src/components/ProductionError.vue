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
          Error while fetching production records
        </span>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn
          color="primary"
          class="text-none"
          @click="fetchProductionList"
        >
          Retry
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ProductionError',
  methods: {
    ...mapActions('productionLog', ['fetchProductionList']),
  },
  computed: {
    reportViewerIllustration() {
      return this.$vuetify.theme.dark
        ? 'report-viewer-dark'
        : 'report-viewer-light';
    },
  },
};
</script>
