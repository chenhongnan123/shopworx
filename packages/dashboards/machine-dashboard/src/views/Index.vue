<template>
  <div style="height:100%">
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
import MachineDashboardLoading from './MachineDashboardLoading.vue';

export default {
  name: 'MachineDashboardIndex',
  components: {
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
    await Promise.all([
      this.getAppSchema(),
      this.getShifts(),
    ]);
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
    ...mapActions('machineDashboard', ['getShifts']),
    startStream() {
      this.evtSource = new EventSource('/sse/asm');
    },
    listenStream() {
      this.evtSource.addEventListener(this.getTimeGranularity(), (evt) => {
        let eventData = JSON.parse(JSON.parse(evt.data));
        eventData = { ...eventData, key: `${eventData.machinename}__${eventData.partname}` };
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
    preview() {
      const doc = window.document;
      const docEl = doc.querySelector('#machine-dashboard');

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
      } else {
        cancelFullScreen.call(doc);
      }
    },
  },
};
</script>
