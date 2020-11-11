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
      </v-tabs>
    </portal>
    <template>
      <v-fade-transition mode="out-in">
        <model-management v-if="recipeView === 0" />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import ModelManagement from './ModelManagement.vue';

export default {
  name: 'ModelManagement',
  components: {
    ModelManagement,
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
