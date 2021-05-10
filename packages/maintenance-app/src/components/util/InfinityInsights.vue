<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
        @click="toggleInsightsDrawer"
      >
        <v-icon
          v-text="'$insights'"
        ></v-icon>
      </v-btn>
    </template>
    <span class="text-center">
      {{ $t('modules.insights') }}
    </span>
  </v-tooltip>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'InfinityInsights',
  methods: {
    ...mapMutations('helper', ['toggleInsightsDrawer']),
  },
};
</script>
