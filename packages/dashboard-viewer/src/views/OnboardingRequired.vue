<template>
  <v-app>
    <dashboard-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
            id="dashboard_illustration"
            contain
          />
        </v-col>
        <v-col cols="12" md="6" lg="5" xl="4" class="text-justify">
          <v-card flat class="transparent">
            <div class="display-1 mb-4 font-weight-medium text-center primary--text">
              Onboarding required
            </div>
            <div class="headline text-center mb-12">
              Please finish Infinity onboarding and refresh this page.
            </div>
            <v-btn
              block
              rounded
              color="primary"
              class="text-none"
            >
              <v-icon
                left
                v-text="'$skip'"
              ></v-icon>
              Go to Infinity
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import DashboardHeader from '../components/DashboardHeader.vue';

export default {
  name: 'OnboardingRequired',
  components: {
    DashboardHeader,
  },
  computed: {
    illustration() {
      return this.$vuetify.theme.dark
        ? 'setup-dark'
        : 'setup-light';
    },
  },
};
</script>
