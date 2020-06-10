<template>
  <v-content>
    <auth-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${registerIllustration}.svg`)"
            contain
          />
        </v-col>
        <v-col cols="12" md="6" lg="5" xl="4">
          <onboarding />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import AuthHeader from '@/components/auth/AuthHeader.vue';
import Onboarding from '../components/Onboarding.vue';

export default {
  name: 'Setup',
  components: {
    AuthHeader,
    Onboarding,
  },
  computed: {
    registerIllustration() {
      return this.$vuetify.theme.dark
        ? 'setup-dark'
        : 'setup-light';
    },
  },
};
</script>
