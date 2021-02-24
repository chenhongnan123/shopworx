<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>{{ $t('roadmapManagement') }}</span>
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
        v-model="roapmapView"
      >
        <v-tab class="text-none">
          List
        </v-tab>
      </v-tabs>
    </portal>
    <roadmap-filter></roadmap-filter>
    <template>
      <v-fade-transition mode="out-in">
        <roadmap-list v-if="roapmapView === 0" />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import RoadmapList from './RoadmapList.vue';
import RoadmapFilter from '../components/RoadmapFilter.vue';

export default {
  name: 'RoadmapManagement',
  components: {
    RoadmapList,
    RoadmapFilter,
  },
  async created() {
    const view = localStorage.getItem('planView');
    this.roapmapView = view ? JSON.parse(view) : 0;
    this.setExtendedHeader(true);
  },
  data() {
    return {
      roapmapView: 0,
    };
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
