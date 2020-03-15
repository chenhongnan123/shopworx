<template>
  <v-card flat class="transparent">
    <v-tabs v-model="selectedAsset">
      <v-tab
        :key="asset.id"
        class="text-none"
        v-for="asset in assets"
      >
        <span v-text="asset.assetDescription"></span>
      </v-tab>
      <v-tab-item
        :key="asset.id"
        v-for="asset in assets"
      >
        <asset-matrix-schema
          v-if="isAssetMatrix"
          :item="item"
        />
        <planning-schema
          v-else
          :categories="categories"
        />
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import AssetMatrixSchema from './AssetMatrixSchema.vue';
import PlanningSchema from './PlanningSchema.vue';

export default {
  name: 'OnboardingContent',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: {
    AssetMatrixSchema,
    PlanningSchema,
  },
  computed: {
    ...mapState('planning', ['assets', 'currentAsset']),
    selectedAsset: {
      get() {
        return this.currentAsset;
      },
      set(val) {
        this.setCurrentAsset(val);
      },
    },
    isAssetMatrix() {
      return this.item && this.item.title === 'ASSETPARTMATRIX';
    },
  },
  methods: {
    ...mapMutations('planning', ['setCurrentAsset']),
  },
};
</script>
