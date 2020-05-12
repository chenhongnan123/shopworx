<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Production Log</span>
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
    <portal
      to="app-extension"
      v-if="onboarded && !loading"
    >
      <v-tabs
        dense
        center-active
        v-model="logView"
      >
        <v-tab class="text-none">
          Production
        </v-tab>
        <v-tab class="text-none">
          Downtime
        </v-tab>
      </v-tabs>
    </portal>
    <production-log-loading v-if="loading" />
    <template v-else>
      <production-log-setup v-if="!onboarded" />
      <v-fade-transition mode="out-in" v-else>
        <keep-alive>
          <production-log-production-view v-if="logView === 0" />
          <production-log-downtime-view v-else-if="logView === 1" />
        </keep-alive>
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import ProductionLogSetup from './ProductionLogSetup.vue';
import ProductionLogLoading from './ProductionLogLoading.vue';
import ProductionLogDowntimeView from './ProductionLogDowntimeView.vue';
import ProductionLogProductionView from './ProductionLogProductionView.vue';

export default {
  name: 'ProductionLog',
  components: {
    ProductionLogSetup,
    ProductionLogLoading,
    ProductionLogDowntimeView,
    ProductionLogProductionView,
  },
  data() {
    return {
      logView: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState('productionLog', ['onboarded']),
  },
  async created() {
    this.loading = true;
    const view = localStorage.getItem('logView');
    this.logView = view ? JSON.parse(view) : 0;
    await this.getOnboardingState();
    if (this.onboarded) {
      this.setExtendedHeader(true);
      await this.getAppSchema();
    }
    this.loading = false;
  },
  watch: {
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionLog', ['getOnboardingState']),
    onboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
    logView(val) {
      localStorage.setItem('logView', val);
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
