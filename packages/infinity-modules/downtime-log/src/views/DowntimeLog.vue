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
    </portal>
    <downtime-log-loading v-if="loading" />
    <template v-else>
      <downtime-log-setup v-if="!onboarded" />
      <template v-else>
        <downtime-toolbar />
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
import DowntimeList from '../components/DowntimeList.vue';

export default {
  name: 'DowntimeLog',
  components: {
    DowntimeLogSetup,
    DowntimeLogLoading,
    DowntimeToolbar,
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
      await this.getAppSchema();
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('downtimeLog', ['getOnboardingState']),
  },
  watch: {
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
  },
};
</script>
