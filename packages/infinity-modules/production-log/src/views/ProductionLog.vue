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
    ...mapState('productionLog', ['dataOnboarded', 'elementOnboarded']),
  },
  async created() {
    this.loading = true;
    await this.getDataOnboardingState();
    if (this.dataOnboarded) {
      await this.getElementOnboardingState();
      if (this.elementOnboarded) {
        await Promise.all([
          this.getAppSchema(),
          this.fetchOperators(),
        ]);
        this.setExtendedHeader(true);
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
    ...mapMutations('productionLog', ['setElementOnboarded']),
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionLog', [
      'getDataOnboardingState',
      'getElementOnboardingState',
      'fetchOperators',
      'fetchProductionList',
      'createElements',
      'getMasterElements',
    ]),
    refreshProductions() {
      this.fetchProductionList();
    },
  },
  watch: {
    async elementOnboarded(val) {
      if (val) {
        this.setExtendedHeader(true);
      }
    },
  },
};
</script>
