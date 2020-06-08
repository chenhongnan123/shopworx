<template>
  <div style="height:100%">
    <portal to="app-header" v-if="!id">
      <span>Machine Dashboard</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon
          v-text="'$settings'"
        ></v-icon>
      </v-btn>
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="enterFullscreen"
      >
        <v-icon
          v-text="'$fullscreen'"
        ></v-icon>
      </v-btn>
    </portal>
    <portal to="app-header" v-else>
      <v-btn
        icon
        v-if="!$vuetify.breakpoint.mdAndDown"
        @click="$router.back()"
      >
        <v-icon v-text="'$left'"></v-icon>
      </v-btn>
      <span>{{ id }}</span>
      <customize-toggle class="ml-2" />
    </portal>
    <machine-dashboard-loading v-if="loading" />
    <template v-else>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import CustomizeToggle from '../components/details/CustomizeToggle.vue';

export default {
  name: 'MachineDashboardIndex',
  components: {
    CustomizeToggle,
  },
  data() {
    return {
      isFullScreen: false,
      loading: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    enterFullscreen() {
      const elem = document.querySelector('#machine-dashboard');
      elem.onfullscreenchange = (event) => {
        const e = event.target;
        this.isFullScreen = document.fullscreenElement === e;
      };
      if (document.fullscreenEnabled) {
        if (!this.isFullScreen) {
          elem.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    },
  },
};
</script>
