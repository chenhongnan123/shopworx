<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>{{ $t('appTitleTraceability') }}</span>
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
    >
      <v-tabs
        dense
        center-active
        v-model="recipeView"
      >
        <v-tab class="text-none">
          Traceability
        </v-tab>
        <v-tab class="text-none">
          Process Data
        </v-tab>
      </v-tabs>
    </portal>
    <template>
      <v-fade-transition mode="out-in">
        <TraceabilityUI v-if="recipeView === 0" />
        <CheckinCheckout v-else/>
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import TraceabilityUI from './TraceabilityUI.vue';
import CheckinCheckout from './CheckinCheckout.vue';

export default {
  name: 'Traceability Main',
  components: {
    TraceabilityUI,
    CheckinCheckout,
  },
  async created() {
    this.recipeView = 0;
    this.setExtendedHeader(true);
  },
  data() {
    return {
      recipeView: 0,
    };
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
