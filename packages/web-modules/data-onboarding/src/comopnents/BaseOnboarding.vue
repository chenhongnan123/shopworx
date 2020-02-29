<template>
  <v-card flat class="transparent">
    <v-tabs
      v-if="isAssetBased"
      v-model="selectedAsset"
    >
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
        <base-onboarding-form
          :element="element"
          :assetId="asset.id"
          :tags="getTags(asset.id)"
        />
      </v-tab-item>
    </v-tabs>
    <base-onboarding-form
      v-else
      :tags="getTags()"
      :element="element"
      :assetId="0"
    />
  </v-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import BaseOnboardingForm from './BaseOnboardingForm.vue';

export default {
  name: 'BaseOnboarding',
  components: {
    BaseOnboardingForm,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('onboarding', ['assets', 'currentAsset']),
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
    isAssetBased() {
      return this.item && this.item.isAssetBased ? this.item.isAssetBased : false;
    },
  },
  methods: {
    ...mapMutations('onboarding', ['setCurrentAsset']),
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
