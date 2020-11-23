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
        class="mb-3"
        height="38"
      />
      <v-toolbar-title
        :class="$vuetify.breakpoint.mdAndUp
          ? 'headline font-weight-medium ml-4'
          : 'title pl-0'"
      >
        Shift-wise shopfloor dashboard
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        class="text-none mr-2"
        color="primary"
        small
      >
        <v-icon left>mdi-cast</v-icon>
        Send to TV
      </v-btn>
      <v-btn
        class="text-none mr-2"
        color="primary"
        outlined
        small
      >
        <v-icon left>mdi-television</v-icon>
        Preview
      </v-btn>
      <v-btn
        class="text-none mr-2"
        color="primary"
        outlined
        small
      >
        <v-icon left>mdi-cog-outline</v-icon>
        Configure
      </v-btn>
      <v-btn
        class="text-none mr-2"
        color="primary"
        exact
        small
        :to="{ name: 'home' }"
        outlined
      >
        <v-icon left>mdi-home-outline</v-icon>
        Home
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
