<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>{{ $t('title') }}</span>
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
          {{ $t('headers.list') }}
        </v-tab>
        <v-tab class="text-none">
          {{ $t('headers.changeover') }}
        </v-tab>
      </v-tabs>
    </portal>
    <recipe-filter></recipe-filter>
    <template>
      <v-fade-transition mode="out-in">
        <recipe-list v-if="recipeView === 0" />
        <recipe-changeover v-else-if="recipeView === 1" />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import RecipeList from './RecipeList.vue';
import RecipeChangeover from './RecipeChangeover.vue';
import RecipeFilter from '../components/RecipeFilter.vue';

export default {
  name: 'RecipeManagement',
  components: {
    RecipeList,
    RecipeChangeover,
    RecipeFilter,
  },
  async created() {
    const view = localStorage.getItem('planView');
    this.recipeView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
    await this.getLines('');
    await this.getSubLines('');
    await this.getStations('');
  },
  data() {
    return {
      recipeView: 0,
    };
  },
  methods: {
    ...mapActions('recipeManagement', ['getLines', 'getSubLines', 'getStations']),
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
