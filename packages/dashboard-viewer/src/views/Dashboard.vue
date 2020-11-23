<template>
  <v-app>
    <v-app-bar
      app
      flat
      :color="$vuetify.theme.dark ? '#121212' : 'white'"
    >
      <img
        :src="require(`@shopworx/assets/logo/${shopworxLogo}.png`)"
        contain
        height="38"
      />
      <v-spacer></v-spacer>
      <v-btn class="text-none mr-2" color="primary">
        Send to TV
      </v-btn>
      <v-btn class="text-none mr-2" color="primary" outlined>
        Preview
      </v-btn>
      <v-btn class="text-none" color="primary" outlined>
        Configure
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
};
</script>
