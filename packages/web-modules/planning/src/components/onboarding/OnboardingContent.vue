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
          :element="element"
          :assetId="asset.id"
          v-if="isAssetMatrix"
          :tags="getTags(asset.id)"
        />
        <planning-schema
          v-else
          :element="element"
          :assetId="asset.id"
          :tags="getTags(asset.id)"
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
    element() {
      return this.item && this.item.element ? this.item.element : null;
    },
    isAssetMatrix() {
      return this.item && this.item.title.toUpperCase().trim() === 'ASSETPARTMATRIX';
    },
  },
  methods: {
    ...mapMutations('planning', ['setCurrentAsset']),
    getTags(assetId = 0) {
      return this.item.tags.filter((tag) => (
        !tag.hide
        && tag.assetId === assetId
        && tag.status.toUpperCase().trim() === 'ACTIVE'
      ));
    },
  },
};
</script>
