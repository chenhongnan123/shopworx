<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>ML Model</span>
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
          Add Model
        </v-tab>
         <v-tab class="text-none">
          Model Orders Logs
        </v-tab>
      </v-tabs>
    </portal>
    <template>
      <v-fade-transition mode="out-in">
        <ModelManagement v-if="recipeView === 0" />
        <ModelOrderLogs v-else />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import ModelManagement from './ModelManagement.vue';
import ModelOrderLogs from './ModelOrderLogs.vue';

export default {
  name: 'ModelDetailst',
  components: {
    ModelManagement,
    ModelOrderLogs,
  },
  async created() {
    // const view = localStorage.getItem('planView');
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
