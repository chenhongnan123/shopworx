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
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2 mb-1"
            @click="refreshProductions"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        Last refreshed at: <strong>{{ lastRefreshedAt }}</strong>
      </v-tooltip>
    </portal>
    <production-log-loading v-if="loading" />
    <template v-else>
      <production-log-setup v-if="!dataOnboarded || !elementOnboarded" />
      <template v-else>
        <production-toolbar />
        <production-drawer />
        <production-list />
      </template>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import ProductionLogSetup from './ProductionLogSetup.vue';
import ProductionLogLoading from './ProductionLogLoading.vue';
import ProductionToolbar from '../components/ProductionToolbar.vue';
import ProductionDrawer from '../components/ProductionDrawer.vue';
import ProductionList from '../components/ProductionList.vue';

export default {
  name: 'ProductionLog',
  components: {
    ProductionLogSetup,
    ProductionLogLoading,
    ProductionToolbar,
    ProductionDrawer,
    ProductionList,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('productionLog', [
      'dataOnboarded',
      'elementOnboarded',
      'lastRefreshedAt',
    ]),
    ...mapState('webApp', ['config', 'storageLocation']),
  },
  async created() {
    this.loading = true;
    const config = localStorage.getItem(this.storageLocation.production);
    if (config) {
      this.setConfig(JSON.parse(config));
    } else {
      this.resetConfig();
    }
    await this.getDataOnboardingState();
    if (this.dataOnboarded) {
      await this.getElementOnboardingState();
      if (this.elementOnboarded) {
        await this.initApp();
      } else {
        await this.getMasterElements();
        const success = await this.createElements();
        if (success) {
          this.setElementOnboarded(true);
        }
      }
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('webApp', ['setConfig', 'resetConfig']),
    ...mapMutations('productionLog', ['setElementOnboarded']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionLog', [
      'getDataOnboardingState',
      'getElementOnboardingState',
      'fetchOperators',
      'fetchRejectionReasons',
      'fetchReworkReasons',
      'fetchScrapReasons',
      'fetchProductionList',
      'createElements',
      'getMasterElements',
    ]),
    refreshProductions() {
      this.fetchProductionList();
    },
    async initApp() {
      await Promise.all([
        this.getAppSchema(),
        this.fetchOperators(),
        this.fetchRejectionReasons(),
        this.fetchReworkReasons(),
        this.fetchScrapReasons(),
      ]);
      this.setExtendedHeader(true);
    },
  },
  watch: {
    async elementOnboarded(val) {
      if (val) {
        await this.initApp();
      }
    },
    config: {
      deep: true,
      handler(val) {
        localStorage.setItem(this.storageLocation.production, JSON.stringify(val));
      },
    },
  },
};
</script>
