<template>
  <v-btn
    icon
    class="px-8"
    @click="toggleInsightsDrawer"
  >
    <v-icon v-text="'$insights'"></v-icon>
  </v-btn>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'Insights',
  methods: {
    ...mapMutations('helper', ['toggleInsightsDrawer']),
  },
};
</script>
