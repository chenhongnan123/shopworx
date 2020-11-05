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
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refreshProductions"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <production-log-loading v-if="loading" />
    <template v-else>
      <production-log-setup v-if="!onboarded" />
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
    ...mapState('productionLog', ['onboarded']),
  },
  async created() {
    this.loading = true;
    await this.getOnboardingState();
    if (this.onboarded) {
      await this.getAppSchema();
      this.setExtendedHeader(true);
    }
    await this.fetchOperators();
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionLog', [
      'getOnboardingState',
      'fetchOperators',
      'fetchProductionList',
    ]),
    refreshProductions() {
      this.fetchProductionList();
    },
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
