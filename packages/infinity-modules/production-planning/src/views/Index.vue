<template>
  <div style="height: 100%">
    <production-planning-loading v-if="loading" />
    <production-planning-setup v-else-if="!loading && !onboarded" />
    <template v-else>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import ProductionPlanningLoading from './ProductionPlanningLoading.vue';
import ProductionPlanningSetup from './ProductionPlanningSetup.vue';

export default {
  name: 'ProductionPlanningIndex',
  components: {
    ProductionPlanningLoading,
    ProductionPlanningSetup,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['onboarded']),
    ...mapState('webApp', ['config', 'storageLocation']),
  },
  async created() {
    this.loading = true;
    const config = localStorage.getItem(this.storageLocation.planning);
    if (config) {
      this.setConfig(JSON.parse(config));
    } else {
      this.resetConfig();
    }
    const appId = localStorage.getItem('appId');
    await this.getAppSchema(appId);
    await this.getOnboardingState();
    if (this.onboarded) {
      await Promise.all([
        this.fetchShifts(),
        this.fetchParts(),
        this.fetchAssets(),
      ]);
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('webApp', ['setConfig', 'resetConfig']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionPlanning', [
      'getOnboardingState',
      'fetchShifts',
      'fetchParts',
      'fetchAssets',
    ]),
  },
  watch: {
    config: {
      deep: true,
      handler(val) {
        localStorage.setItem(this.storageLocation.planning, JSON.stringify(val));
      },
    },
    async onboarded(val) {
      if (val) {
        await Promise.all([
          this.fetchShifts(),
          this.fetchParts(),
          this.fetchAssets(),
        ]);
      }
    },
  },
};
</script>
