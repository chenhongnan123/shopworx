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
          {{ $t('production.errorFetching') }}
        </span>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn
          color="primary"
          class="text-none"
          @click="getProduction"
        >
          {{ $t('production.retry') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ProductionError',
  computed: {
    ...mapState('webApp', ['storageLocation']),
    reportViewerIllustration() {
      return this.$vuetify.theme.dark
        ? 'report-viewer-dark'
        : 'report-viewer-light';
    },
  },
  methods: {
    ...mapMutations('webApp', ['resetConfig']),
    getProduction() {
      localStorage.removeItem(this.storageLocation.production);
      this.resetConfig();
      this.$router.go();
    },
  },
};
</script>
