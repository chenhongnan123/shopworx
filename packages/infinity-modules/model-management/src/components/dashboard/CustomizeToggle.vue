<template>
  <v-btn
    small
    rounded
    outlined
    color="primary"
    class="text-none ml-2"
    @click="toggleCustomizeMode"
  >
    <template v-if="!customizeMode">
      <v-icon left small>mdi-pencil</v-icon>
      Customize dashboard
    </template>
    <template v-else>
      <v-icon left small>mdi-check</v-icon>
      Done
    </template>
  </v-btn>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'CustomizeToggle',
  computed: {
    ...mapState('modelManagement', ['customizeMode']),
  },
  methods: {
    ...mapMutations('modelManagement', ['toggleCustomizeMode']),
  },
};
</script>
