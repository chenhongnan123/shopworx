<template>
  <div>
    <portal to="app-extension">
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
        <!-- <v-tab class="text-none">
          Operators
        </v-tab> -->
      </v-tabs>
    </portal>
    <production-log-production-view v-if="logView === 0" />
    <production-log-downtime-view v-else-if="logView === 1" />
    <production-log-operator-view v-if="logView === 2" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import ProductionLogProductionView from '../components/ProductionLogProductionView.vue';
import ProductionLogDowntimeView from '../components/ProductionLogDowntimeView.vue';
import ProductionLogOperatorView from '../components/ProductionLogOperatorView.vue';

export default {
  name: 'ProductionMachineView',
  components: {
    ProductionLogOperatorView,
    ProductionLogProductionView,
    ProductionLogDowntimeView,
  },
  data() {
    return {
      logView: 0,
    };
  },
  created() {
    const view = localStorage.getItem('logView');
    this.logView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
  },
  watch: {
    logView(val) {
      localStorage.setItem('logView', val);
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
