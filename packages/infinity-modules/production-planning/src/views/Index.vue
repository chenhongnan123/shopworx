<template>
  <div style="height: 100%">
    <production-planning-loading v-if="loading" />
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

export default {
  name: 'ProductionPlanningIndex',
  components: {
    ProductionPlanningLoading,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
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
    await Promise.all([
      this.fetchShifts(),
      this.fetchParts(),
      this.fetchAssets(),
    ]);
    this.loading = false;
  },
  methods: {
    ...mapMutations('webApp', ['setConfig', 'resetConfig']),
    ...mapActions('productionPlanning', [
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
  },
};
</script>
