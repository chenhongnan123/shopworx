<template>
  <v-bottom-navigation app grow color="primary" v-model="bottomNav">
    <v-btn :to="{ path: '/dashboard' }">
      <span v-text="$t('modules.dashboards')"></span>
      <v-icon v-text="'$home'"></v-icon>
    </v-btn>
    <v-btn :to="{ name: 'calendar' }">
      <span v-text="$t('modules.calendar')"></span>
      <v-icon v-text="'mdi-calendar-multiselect'"></v-icon>
    </v-btn>
    <v-btn :to="{ name: 'list' }">
      <span v-text="$t('modules.list')"></span>
      <v-icon v-text="'mdi-format-list-bulleted-square'"></v-icon>
    </v-btn>
    <v-btn :to="{ name: 'repair' }">
      <span v-text="$t('modules.repair')"></span>
      <v-icon v-text="'mdi-hammer-wrench'"></v-icon>
    </v-btn>
    <v-btn :to="{ name: 'user' }">
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
