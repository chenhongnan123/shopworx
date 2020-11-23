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
          <span class="display-4 font-weight-medium">
            ShopWorx Dashboard Viewer
          </span>
        </v-col>
        <v-col cols="12" align="center">
          <span class="title">
            <v-icon left>mdi-cast</v-icon>
            Ready to connect
          </span>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import DashboardHeader from '../components/DashboardHeader.vue';

export default {
  name: 'Cast',
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
