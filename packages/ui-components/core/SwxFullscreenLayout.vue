<template>
  <div>
    <v-app-bar
      app
      flat
      :color="$vuetify.theme.dark ? '#121212' : 'white'"
    >
      <v-toolbar-title>
        <img
          :src="require(`@shopworx/assets/logos/${logoName}.png`)"
          contain
          height="40"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <slot name="navbarItems" />
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <perfect-scrollbar>
        <v-container
          :style="$vuetify.breakpoint.mdAndUp
            ? 'height: calc(100vh - 64px)'
            : 'height: calc(100vh - 56px)'"
        >
          <v-row no-gutters justify="center" align="center">
            <v-col cols="12">
              <slot />
            </v-col>
          </v-row>
        </v-container>
      </perfect-scrollbar>
    </v-content>
  </div>
</template>

<script>
export default {
  name: 'SwxFullscreenLayout',
  computed: {
    logoName() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
};
</script>
