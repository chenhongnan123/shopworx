<template>
  <product-list/>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import ProductList from './ProductList.vue';

export default {
  name: 'ProductManagement',
  components: {
    ProductList,
  },
  data() {
    return {};
  },
  async created() {
    this.setExtendedHeader(false);
    await this.getLines('');
    await this.getRoadmaps('');
    await this.getBOM('');
    await this.getProductTypeCategory('');
  },
  methods: {
    ...mapActions('productManagement', ['getLines', 'getRoadmaps', 'getBOM', 'getProductTypeCategory']),
    ...mapMutations('helper', ['setExtendedHeader']),
  },
};
</script>
