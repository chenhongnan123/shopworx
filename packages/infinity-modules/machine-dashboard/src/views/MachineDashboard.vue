<template>
  <div
    id="machine-dashboard"
    :class="[
      $vuetify.theme.dark ? '#121212' : 'white',
      isFullScreen ? 'pa-4' : '',
    ]"
  >
    <portal to="app-header">
      <v-toolbar-title class="headline font-weight-medium">
        Machine Dashboard
        <v-icon
          class="ml-4 mb-1"
          v-text="'$info'"
        ></v-icon>
        <v-icon
          class="ml-2 mb-1"
          v-text="'$fullscreen'"
          @click="enterFullscreen"
        ></v-icon>
      </v-toolbar-title>
    </portal>
    Coming soon!
  </div>
</template>

<script>
export default {
  name: 'MachineDashboard',
  data() {
    return {
      isFullScreen: false,
    };
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
