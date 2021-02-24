<template>
  <div>
    <part-master v-if="id === 'parts'" />
    <asset-config v-else-if="id === 'assets'" />
    <import-plans v-else-if="id === 'import'" />
  </div>
</template>

<script>
import PartMaster from './PartMaster.vue';
import AssetConfig from './AssetConfig.vue';
import ImportPlans from './ImportPlans.vue';

export default {
  name: 'AdminWindow',
  components: {
    PartMaster,
    AssetConfig,
    ImportPlans,
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
