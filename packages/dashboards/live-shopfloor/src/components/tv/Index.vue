<template>
  <v-responsive :max-height="cHeight" :min-height="cHeight">
    <v-container
      grid-list-lg
      fluid
      v-resize="onResize"
    >
      <tv-toolbar />
      <tv-dashboard />
    </v-container>
  </v-responsive>
</template>

<script>
import TvToolbar from './Toolbar.vue';
import TvDashboard from './Dashboard.vue';

export default {
  name: 'NonTvLayout.vue',
  components: {
    TvToolbar,
    TvDashboard,
  },
  data() {
    return {
      cHeight: window.innerHeight,
    };
  },
  mounted() {
    this.onResize();
  },
  methods: {
    onResize() {
      this.cHeight = window.innerHeight;
      console.log({
        x: window.innerWidth,
        y: window.innerHeight,
      });
    },
  },
};
</script>
