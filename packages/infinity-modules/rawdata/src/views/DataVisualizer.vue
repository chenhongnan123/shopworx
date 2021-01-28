<template>
  <div>
    <portal to="app-header">
      Data Visualizer
    </portal>
    <portal
      to="app-extension"
    >
      <v-tabs
        dense
        center-active
        v-model="parameterView"
      >
        <v-tab class="text-none">
          Tabular Data
        </v-tab>
        <v-tab class="text-none">
          Graphical Data
        </v-tab>
      </v-tabs>
    </portal>
    <template>
      <v-fade-transition mode="out-in">
        <tabular-data v-if="parameterView === 0" />
        <graphical-data v-else />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import TabularData from './TabularData.vue';
import GraphicalData from './GraphicalData.vue';

export default {
  name: 'RawData',
  components: {
    TabularData,
    GraphicalData,
  },
  data() {
    return {
      parameterView: 0,
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.parameterView = 0;
    this.setExtendedHeader(true);
    this.loading = false;
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
