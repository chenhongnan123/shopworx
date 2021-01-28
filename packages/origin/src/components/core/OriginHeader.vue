<template>
  <v-app-bar
    app
    short
    clipped-right
    elevate-on-scroll
    :color="$vuetify.theme.dark ? '#121212' : 'white'"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown && $route.params.id === undefined"
      @click="$emit('toggle-drawer')"
    ></v-app-bar-nav-icon>
    <v-btn
      icon
      v-else-if="$vuetify.breakpoint.mdAndDown && $route.params.id"
      @click="$router.back()"
    >
      <v-icon v-text="'$left'"></v-icon>
    </v-btn>
    <v-toolbar-title
      :class="$vuetify.breakpoint.mdAndUp
        ? 'headline font-weight-medium'
        : 'title pl-0'"
    >
      <portal-target name="app-header"></portal-target>
    </v-toolbar-title>
    <template #extension v-if="extendedHeader">
      <portal-target name="app-extension" slim />
    </template>
    <v-spacer></v-spacer>
    <origin-set-context v-if="$route.path.includes('customer') && isContextSet" />
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <origin-help />
      <origin-account />
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import OriginSetContext from '@/components/util/OriginSetContext.vue';
import OriginAccount from '@/components/util/OriginAccount.vue';
import OriginHelp from '@/components/util/OriginHelp.vue';

export default {
  name: 'OriginHeader',
  components: {
    OriginSetContext,
    OriginAccount,
    OriginHelp,
  },
  computed: {
    ...mapState('user', ['me']),
    ...mapState('helper', ['extendedHeader']),
    isContextSet() {
      return this.me;
    },
  },
};
</script>

<style>
.v-toolbar .v-toolbar__extension {
  z-index: -1;
}
</style>
