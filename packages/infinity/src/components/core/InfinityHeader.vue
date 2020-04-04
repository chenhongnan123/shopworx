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
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <infinity-search />
      <infinity-insights />
      <infinity-help />
      <infinity-account />
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import InfinityAccount from '@/components/util/InfinityAccount.vue';
import InfinityHelp from '@/components/util/InfinityHelp.vue';
import InfinityInsights from '@/components/util/InfinityInsights.vue';
import InfinitySearch from '@/components/util/InfinitySearch.vue';

export default {
  name: 'InfinityHeader',
  components: {
    InfinityAccount,
    InfinityHelp,
    InfinityInsights,
    InfinitySearch,
  },
  computed: {
    ...mapState('helper', ['extendedHeader']),
  },
};
</script>
