<template>
  <v-toolbar
    flat
    dense
    :color="$vuetify.theme.dark ? '#121212' : 'grey lighten-5'"
  >
    <template v-if="!window">
      <v-toolbar-title v-text="$t('infinity.insights.toolbar.title')">
      </v-toolbar-title>
    </template>
    <template v-else>
      <v-btn icon @click="setWindow(0)">
        <v-icon v-text="'$leftArrow'"></v-icon>
      </v-btn>
      <v-toolbar-title v-text="$t('infinity.insights.toolbar.back')">
      </v-toolbar-title>
    </template>
    <v-spacer></v-spacer>
    <v-btn icon @click="toggleInsightsDrawer">
      <v-icon v-text="'$close'"></v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'InsightsToolbar',
  computed: {
    ...mapState('insight', ['window']),
  },
  methods: {
    ...mapMutations('helper', ['toggleInsightsDrawer']),
    ...mapMutations('insight', ['setWindow']),
  },
};
</script>
