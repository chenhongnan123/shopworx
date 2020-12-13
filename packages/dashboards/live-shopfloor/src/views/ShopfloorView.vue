<template>
  <div>
    <shopfloor-layout />
    <!-- <tv-layout v-if="isTV"/>
    <non-tv-layout v-else /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ShopfloorLayout from '../components/ShopfloorLayout.vue';

export default {
  name: 'ShopfloorView',
  components: {
    ShopfloorLayout,
  },
  computed: {
    ...mapGetters('helper', ['isTV']),
  },
};
</script>
