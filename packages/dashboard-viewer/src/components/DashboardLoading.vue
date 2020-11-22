<template>
  <v-main :class="$vuetify.theme.dark ? '#121212' : 'white'">
    <dashboard-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" align="center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="72"
          ></v-progress-circular>
        </v-col>
        <v-col cols="12" align="center">
          <span class="display-3">
            Loading
          </span>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DashboardHeader from './DashboardHeader.vue';

export default {
  name: 'DashboardLoading',
  components: {
    DashboardHeader,
  },
  computed: {
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
};
</script>
