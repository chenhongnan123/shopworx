<template>
  <v-app-bar
    app
    clipped-right
    elevate-on-scroll
    extension-height="28"
    :color="$vuetify.theme.dark ? '#121212' : 'white'"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown"
      @click="$emit('toggle-drawer')"
    ></v-app-bar-nav-icon>
    <portal-target name="app-header"></portal-target>
    <template #extension v-if="extendedHeader">
      <portal-target name="app-tabs" slim />
    </template>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-text-field
        outlined
        flat
        dense
        rounded
        single-line
        class="mt-2 mr-2"
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
      class="text-none"
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
    <account-menu />
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import AccountMenu from '@/components/util/AccountMenu.vue';

export default {
  name: 'InfinityHeader',
  components: {
    AccountMenu,
  },
  computed: {
    ...mapState('helper', ['extendedHeader']),
  },
};
</script>
