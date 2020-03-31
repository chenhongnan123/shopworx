<template>
  <v-app-bar
    app
    flat
    clipped-right
    :color="$vuetify.theme.dark ? '#121212' : 'grey lighten-5'"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown"
      @click="$emit('toggle-drawer')"
    ></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-toolbar-items>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  name: 'InfinityHeader',
};
</script>
