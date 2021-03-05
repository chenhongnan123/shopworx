<template>
  <v-bottom-navigation
    app
    grow
    color="primary"
    v-model="bottomNav"
  >
    <v-btn :to="{ path: '/'}">
      <span v-text="$t('modules.home')"></span>
      <v-icon v-text="'$home'"></v-icon>
    </v-btn>
    <!-- <v-btn disabled :to="{ name: 'search'}">
      <span v-text="$t('modules.searchMobile')"></span>
      <v-icon v-text="'$search'"></v-icon>
    </v-btn> -->
    <v-btn @click="toggleInsightsDrawer">
      <span v-text="$t('modules.insights')"></span>
      <v-icon v-text="'$insights'"></v-icon>
    </v-btn>
    <v-btn :to="{ name: 'user'}">
      <span v-text="$t('account.account')"></span>
      <v-icon v-text="'$account'"></v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'InfinityBottom',
  data() {
    return {
      bottomNav: false,
    };
  },
  methods: {
    ...mapMutations('helper', ['toggleInsightsDrawer']),
  },
};
</script>
