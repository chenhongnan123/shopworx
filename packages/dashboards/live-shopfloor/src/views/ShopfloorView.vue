<template>
  <tv-layout v-if="isTV"/>
  <non-tv-layout v-else />
</template>

<script>
import { mapGetters } from 'vuex';
import NonTvLayout from '../components/non-tv/Index.vue';
import TvLayout from '../components/tv/Index.vue';

export default {
  name: 'ShopfloorView',
  components: {
    NonTvLayout,
    TvLayout,
  },
  computed: {
    ...mapGetters('helper', ['isTV']),
  },
};
</script>
