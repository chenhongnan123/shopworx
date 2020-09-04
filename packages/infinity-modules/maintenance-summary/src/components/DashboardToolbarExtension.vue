<template>
  <portal to="app-extension">
    <v-toolbar
      flat
      dense
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <div class="mt-1">
        <span class="title">
          {{ shift }} - {{ date }}
        </span>
      </div>
    </v-toolbar>
  </portal>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'DashboardToolbarExtension',
  computed: {
    shift() {
      return 'Shift 1';
    },
    date() {
      return formatDate(new Date(), 'PP');
    },
  },
};
</script>
