<template>
  <v-container fluid style="height:100%">
    <portal to="app-header">
      Data Visualizer
    </portal>
    <v-row style="height:100%" no-gutters>
      <v-col cols="12" sm="4" lg="3" xl="2">
        <filter-drawer :loading="loading" />
      </v-col>
      <v-col>
        <v-tabs v-model="tab">
          <v-tab
            v-for="item in items"
            :key="item.component"
          >
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" style="height:calc(100% - 36px)">
          <v-tab-item
            v-for="item in items"
            :key="item.component"
            style="height:100%"
          >
            <v-card flat style="height:100%">
              <v-card-text style="height:100%" class="px-0">
                <component :is="item.component" />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import FilterDrawer from '../components/FilterDrawer.vue';
import DataProfile from '../components/DataProfile.vue';
import Visualization from '../components/Visualization.vue';

export default {
  name: 'DataVisualizer',
  components: {
    FilterDrawer,
    DataProfile,
    Visualization,
  },
  data() {
    return {
      tab: 0,
      loading: false,
      items: [{
        name: 'Data profile',
        component: 'data-profile',
      }, {
        name: 'visualization',
        component: 'visualization',
      }],
    };
  },
  methods: {
    ...mapActions('dataVisualizer', [
      'getElements',
      'getLines',
    ]),
  },
  async created() {
    this.loading = true;
    await Promise.all([
      this.getElements(),
      this.getLines(),
    ]);
    this.loading = false;
  },
};
</script>

<style>
.v-window__container {
  height: 100%;
}
</style>
