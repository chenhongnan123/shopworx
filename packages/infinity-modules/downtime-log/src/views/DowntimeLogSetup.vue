<template>
  <v-container fluid class="pa-0 ma-0" style="height:100%">
    <v-row
      align="center"
      justify="center"
      style="height:100%"
    >
      <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
        <v-img
          :src="require(`@shopworx/assets/illustrations/${downtimeIllustration}.svg`)"
          contain
        />
      </v-col>
      <v-col cols="12" md="6" lg="5" xl="4">
        <downtime-onboarding />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DowntimeOnboarding from '../components/onboarding/DowntimeOnboarding.vue';

export default {
  name: 'DowntimeLogSetup',
  components: {
    DowntimeOnboarding,
  },
  computed: {
    downtimeIllustration() {
      return this.$vuetify.theme.dark
        ? 'downtime-dark'
        : 'downtime-light';
    },
  },
};
</script>
