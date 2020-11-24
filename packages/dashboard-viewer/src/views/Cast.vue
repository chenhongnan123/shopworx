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
          <div class="display-4 font-weight-medium">
            ShopWorx TV
          </div>
          <div class="title font-weight-medium mt-8">
            Dashboards that make you lookup and take notice!
          </div>
          <div class="headline font-weight-medium primary--text">
            Device ID: 123ABC
          </div>
        </v-col>
        <v-col
          cols="12"
          align="center"
          class="mt-12"
          v-if="connected"
        >
          <span class="title">
            <v-icon left>mdi-cast-connected</v-icon>
            Connected
          </span>
        </v-col>
        <v-col
          cols="12"
          align="center"
          class="mt-12"
          v-else
        >
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
import { mapState } from 'vuex';
import DashboardHeader from '../components/DashboardHeader.vue';

export default {
  name: 'Cast',
  components: {
    DashboardHeader,
  },
  computed: {
    ...mapState('dashboard', ['readyState']),
    connected() {
      return this.readyState === 1;
    },
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
};
</script>
