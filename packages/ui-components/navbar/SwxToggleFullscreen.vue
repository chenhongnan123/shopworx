<template>
  <v-btn
    icon
    :class="buttonClass"
    @click="toggleFullscreen"
  >
    <v-icon
      v-if="!isFullscreen"
      v-text="'$fullscreen'"
    ></v-icon>
    <v-icon
      v-else
      v-text="'$exitFullscreen'"
    ></v-icon>
  </v-btn>
</template>

<script>
export default {
  name: 'SwxToggleFullscreen',
  props: {
    buttonClass: {
      type: String,
      default: 'px-8',
    },
  },
  data() {
    return {
      isFullscreen: false,
    };
  },
  methods: {
    toggleFullscreen() {
      if (document.fullscreenEnabled) {
        if (!this.isFullscreen) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        this.isFullscreen = !this.isFullscreen;
      }
    },
  },
};
</script>
