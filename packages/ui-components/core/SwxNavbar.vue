<template>
  <v-app-bar
    app
    flat
    clipped-right
    :color="$vuetify.theme.dark ? '#121212' : 'grey lighten-5'"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown"
      @click="toggleSidebar"
    ></v-app-bar-nav-icon>
    <slot name="navbar" />
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <slot />
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  name: 'SwxNavbar',
  methods: {
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
  },
};
</script>
