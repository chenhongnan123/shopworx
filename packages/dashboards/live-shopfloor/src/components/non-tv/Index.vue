<template>
  <v-responsive>
    <v-container
      grid-list-lg
      fluid
    >
      <non-tv-toolbar />
      <non-tv-dashboard />
    </v-container>
  </v-responsive>
</template>

<script>
import NonTvToolbar from './Toolbar.vue';
import NonTvDashboard from './Dashboard.vue';

export default {
  name: 'NonTvLayout.vue',
  components: {
    NonTvToolbar,
    NonTvDashboard,
  },
};
</script>
