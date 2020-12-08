<template>
  <v-app>
    <v-app-bar
      app
      flat
      v-if="!isTV"
      :color="$vuetify.theme.dark ? '#121212' : 'white'"
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
        Shift-wise shopfloor dashboard
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <send-to-tv />
      <v-btn
        class="text-none mr-2"
        color="primary"
        outlined
        small
        @click="previewDashboard"
      >
        <v-icon left>mdi-television</v-icon>
        Preview
      </v-btn>
      <v-btn
        class="text-none mr-2"
        color="primary"
        outlined
        small
        @click="toggleConfigDrawer"
      >
        <v-icon left>mdi-cog-outline</v-icon>
        Configure
      </v-btn>
      <v-btn
        class="text-none mr-2"
        color="primary"
        exact
        small
        :to="{ name: 'home' }"
        outlined
      >
        <v-icon left>mdi-home-outline</v-icon>
        Home
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view id="dashboard-container" />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import SendToTv from '../components/SendToTv.vue';

export default {
  name: 'Dashboard',
  components: {
    SendToTv,
  },
  computed: {
    ...mapGetters('helper', ['isTV']),
    shopworxLogo() {
      return this.$vuetify.theme.dark
        ? 'shopworx-dark'
        : 'shopworx-light';
    },
  },
  methods: {
    ...mapMutations('helper', ['toggleConfigDrawer', 'setIsFullscreen']),
    previewDashboard() {
      const doc = window.document;
      const docEl = doc.querySelector('#dashboard-container');

      docEl.onfullscreenchange = (event) => {
        const e = event.target;
        this.setIsFullscreen(document.fullscreenElement === e);
      };

      const requestFullScreen = docEl.requestFullscreen
        || docEl.mozRequestFullScreen
        || docEl.webkitRequestFullScreen
        || docEl.msRequestFullscreen;
      const cancelFullScreen = doc.exitFullscreen
        || doc.mozCancelFullScreen
        || doc.webkitExitFullscreen
        || doc.msExitFullscreen;

      if (!doc.fullscreenElement
        && !doc.mozFullScreenElement
        && !doc.webkitFullscreenElement
        && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
        this.setIsFullscreen(true);
      } else {
        cancelFullScreen.call(doc);
        this.setIsFullscreen(false);
      }
    },
  },
};
</script>
