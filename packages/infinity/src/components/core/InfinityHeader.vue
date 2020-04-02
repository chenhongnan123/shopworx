<template>
  <v-app-bar
    app
    clipped-right
    elevate-on-scroll
    :color="$vuetify.theme.dark ? '#121212' : 'grey lighten-5'"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown"
      @click="$emit('toggle-drawer')"
    ></v-app-bar-nav-icon>
    <portal-target name="app-header"></portal-target>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-text-field
        solo
        flat
        dense
        rounded
        single-line
        class="mt-3"
        hide-details
        label="Search"
        v-if="$vuetify.breakpoint.mdAndUp"
      >
        <template #prepend-inner>
          <v-icon v-text="'$search'"></v-icon>
        </template>
      </v-text-field>
    </v-toolbar-items>
    <v-btn
      text
      color="primary"
      class="mx-1 text-none"
      :icon="$vuetify.breakpoint.smAndDown"
    >
      <v-icon
        v-text="'$insights'"
        :left="$vuetify.breakpoint.mdAndUp"
      ></v-icon>
      <span v-if="$vuetify.breakpoint.mdAndUp">
        Insights
      </span>
    </v-btn>
    <v-avatar
      size="38"
      color="secondary"
    >
      <v-icon v-text="'$account'"></v-icon>
    </v-avatar>
  </v-app-bar>
</template>

<script>
export default {
  name: 'InfinityHeader',
};
</script>
