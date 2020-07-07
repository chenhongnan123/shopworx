<template>
  <div style="height:100%">
    <portal to="app-header" v-if="!id">
      Shopfloor Dashboard
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
import { mapState, mapMutations, mapActions } from 'vuex';
import CustomizeToggle from '../components/details/CustomizeToggle.vue';
import MachineDashboardLoading from './MachineDashboardLoading.vue';

export default {
  name: 'MachineDashboardIndex',
  components: {
    CustomizeToggle,
    MachineDashboardLoading,
  },
  data() {
    return {
      isFullScreen: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('machineDashboard', ['selectedTime']),
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.loading = true;
    await this.getAppSchema();
    this.loading = false;
  },
  beforeMount() {
    this.startStream();
    this.listenStream();
  },
  beforeDestroy() {
    this.closeStream();
  },
  watch: {
    selectedTime() {
      this.listenStream();
    },
  },
  methods: {
    ...mapMutations('machineDashboard', ['setAssetData']),
    ...mapActions('webApp', ['getAppSchema']),
    startStream() {
      this.evtSource = new EventSource('/sse/asm');
    },
    listenStream() {
      this.evtSource.addEventListener(this.getTimeGranularity(), (evt) => {
        let eventData = JSON.parse(JSON.parse(evt.data));
        eventData = { ...eventData, key: eventData.machinename };
        this.setAssetData(eventData);
      });
    },
    closeStream() {
      this.evtSource.close();
    },
    getTimeGranularity() {
      switch (this.selectedTime) {
        case 0:
          return 'hourly';
        case 1:
          return 'shift';
        default:
          return 'hourly';
      }
    },
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
