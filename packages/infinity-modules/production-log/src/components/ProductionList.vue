<template>
  <div style="height:100%">
    <template v-if="loading">
      <production-loading />
    </template>
    <production-details />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ProductionLoading from './ProductionLoading.vue';
import ProductionDetails from './production/ProductionDetails.vue';

export default {
  name: 'ProductionList',
  components: {
    ProductionLoading,
    ProductionDetails,
  },
  computed: {
    ...mapState('productionLog', [
      'loading',
    ]),
  },
};
</script>
