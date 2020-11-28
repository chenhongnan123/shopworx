<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Downtime Log</span>
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
        @click="refreshDowntimes"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <downtime-log-loading v-if="loading" />
    <template v-else>
      <downtime-log-setup v-if="!onboarded" />
      <template v-else>
        <downtime-toolbar />
        <downtime-drawer />
        <downtime-list />
      </template>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import DowntimeLogSetup from './DowntimeLogSetup.vue';
import DowntimeLogLoading from './DowntimeLogLoading.vue';
import DowntimeToolbar from '../components/DowntimeToolbar.vue';
import DowntimeDrawer from '../components/DowntimeDrawer.vue';
import DowntimeList from '../components/DowntimeList.vue';

export default {
  name: 'DowntimeLog',
  components: {
    DowntimeLogSetup,
    DowntimeLogLoading,
    DowntimeToolbar,
    DowntimeDrawer,
    DowntimeList,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', ['onboarded']),
  },
  async created() {
    this.loading = true;
    await this.getOnboardingState();
    if (this.onboarded) {
      await Promise.all([
        this.getAppSchema(),
        this.fetchDowntimeReasons(),
      ]);
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('downtimeLog', [
      'getOnboardingState',
      'fetchDowntimeReasons',
      'fetchDowntimeList',
    ]),
    refreshDowntimes() {
      this.fetchDowntimeList();
    },
  },
  watch: {
    async onboarded(val) {
      if (val) {
        await Promise.all([
          this.getAppSchema(),
          this.fetchDowntimeReasons(),
        ]);
        this.setExtendedHeader(true);
      }
    },
  },
};
</script>
