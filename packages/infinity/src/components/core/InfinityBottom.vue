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
    <v-btn disabled :to="{ name: 'search'}">
      <span v-text="$t('modules.search')"></span>
      <v-icon v-text="'$search'"></v-icon>
    </v-btn>
    <v-btn disabled :to="{ name: 'insights'}">
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
export default {
  name: 'InfinityBottom',
  data() {
    return {
      bottomNav: false,
    };
  },
};
</script>
