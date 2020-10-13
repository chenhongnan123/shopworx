<template>
  <div style="height:100%">
    <portal to="app-header" v-if="!id">
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
    <portal to="app-header" v-else>
      <v-btn
        icon
        v-if="!$vuetify.breakpoint.mdAndDown"
        @click="$router.back()"
      >
        <v-icon v-text="'$left'"></v-icon>
      </v-btn>
    </portal>
    <production-log-loading v-if="loading" />
    <template v-else>
      <production-log-setup v-if="!onboarded" />
      <template v-else>
        <production-list/>
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </template>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import ProductionLogSetup from './ProductionLogSetup.vue';
import ProductionLogLoading from './ProductionLogLoading.vue';
import ProductionList from '../components/ProductionList.vue';

export default {
  name: 'ProductionLog',
  components: {
    ProductionLogSetup,
    ProductionLogLoading,
    ProductionList,
  },
  data() {
    return {
      logView: 0,
      loading: false,
    };
  },
  computed: {
    ...mapState('productionLog', ['onboarded']),
    id() {
      return this.$route.params.id;
    },
  },
  async created() {
    this.loading = true;
    await this.getOnboardingState();
    await this.getBusinessHours();
    await this.getHours();
    if (this.onboarded) {
      await this.getAppSchema();
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('calendar', ['getBusinessHours']),
    ...mapActions('productionLog', ['getOnboardingState', 'getHours']),
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
