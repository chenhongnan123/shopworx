<template>
  <v-app>
    <v-app-bar
      app
      short
      elevate-on-scroll
      :color="$vuetify.theme.dark ? '#121212' : 'white'"
    >
      <v-container class="py-0 fill-height">
        <img
          :src="require(`@shopworx/assets/logo/${logoName}.png`)"
          contain
          class="mb-2"
          height="38"
        />
        <v-toolbar-title
          :class="$vuetify.breakpoint.mdAndUp
            ? 'headline font-weight-medium'
            : 'title pl-0'"
        >
          <span class="ml-4">
            On-board new customer
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none"
          color="secondary"
          :to="{ name: 'customerAssets' }"
        >
          Exit & return to Origin
        </v-btn>
      </v-container>
    </v-app-bar>
    <v-main :class="$vuetify.theme.dark ? '#121212' : 'grey lighten-4'">
      <customer-container />
    </v-main>
  </v-app>
</template>

<script>
import CustomerContainer from './CustomerContainer.vue';

export default {
  name: 'CustomerAddNew',
  components: {
    CustomerContainer,
  },
  computed: {
    logoName() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
};
</script>
