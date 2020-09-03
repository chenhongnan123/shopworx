<template>
  <v-btn
    small
    rounded
    outlined
    color="primary"
    class="text-none mb-1"
    @click="toggleCustomizeMode"
  >
    <template v-if="!customizeMode">
      <v-icon left small>mdi-pencil</v-icon>
      {{ $t('shopfloorDashboard.customize') }}
    </template>
    <template v-else>
      <v-icon left small>mdi-check</v-icon>
      {{ $t('shopfloorDashboard.done') }}
    </template>
  </v-btn>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'CustomizeToggle',
  computed: {
    ...mapState('machineDashboard', ['customizeMode']),
  },
  methods: {
    ...mapMutations('machineDashboard', ['toggleCustomizeMode']),
  },
};
</script>
