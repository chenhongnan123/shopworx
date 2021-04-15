<template>
  <div>
    <portal to="dashboard-title">
      Overall Production Information
    </portal>
    <v-container
      grid-list-lg
      fluid
      style="height: 100%"
      ref="container"
      :class="theme.isDark ? '' : 'grey lighten-5'"
      class="py-0"
      v-resize="onResize"
    >
      <v-responsive :max-height="cHeight" :min-height="cHeight">
        Dashboard
      </v-responsive>
    </v-container>
    <v-app-bar
      flat
      v-if="isTV || isFullscreen"
      :color="theme.isDark ? '#121212' : 'grey lighten-5'"
    >
      <img
        :src="require(`@shopworx/assets/logo/${shopworxLogo}.png`)"
        contain
        class="mb-3"
        height="38"
      />
      <v-toolbar-title
        :class="$vuetify.breakpoint.mdAndUp
          ? 'headline font-weight-medium ml-4'
          : 'title pl-0'"
      >
        Overall Production Information
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="headline font-weight-medium">
        {{ now }}
      </span>
    </v-app-bar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'DashboardView',
  inject: ['theme'],
  data() {
    return {
      now: null,
      timeInterval: null,
      cHeight: window.innerHeight,
    };
  },
  created() {
    const self = this;
    this.timeInterval = setInterval(() => {
      self.now = formatDate(new Date().getTime(), 'HH:mm');
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  computed: {
    ...mapGetters('helper', ['isTV']),
    ...mapState('helper', ['isFullscreen', 'configDrawer']),
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
  methods: {
    onResize() {
      if (this.isTV || this.isFullscreen) {
        this.cHeight = window.innerHeight - 64;
      } else {
        this.cHeight = window.innerHeight - 64;
      }
    },
  },
};
</script>
