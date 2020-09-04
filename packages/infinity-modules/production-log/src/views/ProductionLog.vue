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
      <v-fade-transition mode="out-in" v-else>
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import ProductionLogSetup from './ProductionLogSetup.vue';
import ProductionLogLoading from './ProductionLogLoading.vue';

export default {
  name: 'ProductionLog',
  components: {
    ProductionLogSetup,
    ProductionLogLoading,
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
    if (this.onboarded) {
      await this.getAppSchema();
      this.setExtendedHeader(true);
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionLog', ['getOnboardingState']),
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
