<template>
  <v-card flat class="transparent">
    <template v-if="loading">
      Loading...
    </template>
    <template v-else-if="error">
      Error
    </template>
    <template v-else>
      <v-card-title class="pa-0 py-1">
        <span v-text="$t(`admin.items.${id}`)"></span>
      </v-card-title>
      <!-- <component :is="component" /> -->
    </template>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MasterWindow',
  computed: {
    ...mapState('admin', ['loading', 'error']),
    id() {
      return this.$route.params.id;
    },
    component() {
      switch (this.id) {
        case 'users':
          return 'users';
        case 'roles':
          return 'roles';
        default:
          return null;
      }
    },
  },
};
</script>
