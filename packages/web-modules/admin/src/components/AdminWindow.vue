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
        <span v-text="$t(`admin.items.${id}.subTitle`)"></span>
      </v-card-title>
      <component :is="component" />
    </template>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Info from './Info.vue';
import Users from './Users.vue';
import Permissions from './Permissions.vue';
import Alerts from './Alerts.vue';
import Billing from './Billing.vue';

export default {
  name: 'MasterWindow',
  components: {
    Info,
    Users,
    Permissions,
    Alerts,
    Billing,
  },
  computed: {
    ...mapState('admin', ['loading', 'error']),
    id() {
      return this.$route.params.id;
    },
    component() {
      switch (this.id) {
        case 'info':
          return 'info';
        case 'users':
          return 'users';
        case 'permissions':
          return 'permissions';
        case 'alerts':
          return 'alerts';
        case 'billing':
          return 'billing';
        default:
          return null;
      }
    },
  },
};
</script>
