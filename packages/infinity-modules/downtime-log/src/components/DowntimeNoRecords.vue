<template>
  <v-container :fill-height="!isMobile">
    <v-row
      align="center"
      justify="center"
      :no-gutters="$vuetify.breakpoint.smAndDown"
    >
      <v-col cols="5" align="center">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${notFoundIllustration}.svg`)"
          contain
        />
      </v-col>
      <v-col cols="12" align="center">
        <span class="headline">
          No downtime record for selected filters
        </span>
      </v-col>
      <v-col cols="12" align="center">
        <v-btn
          color="primary"
          class="text-none"
          @click="resetFilters"
        >
          Reset filters
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'DowntimeNoRecords',
  computed: {
    ...mapState('webApp', ['storageLocation']),
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  methods: {
    ...mapMutations('webApp', ['resetConfig']),
    resetFilters() {
      localStorage.removeItem(this.storageLocation.downtime);
      this.resetConfig();
      this.$router.go();
    },
  },
};
</script>
