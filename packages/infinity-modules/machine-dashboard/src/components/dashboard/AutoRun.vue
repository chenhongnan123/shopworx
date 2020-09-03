<template>
  <v-switch
    hide-details
    label="Autorun"
    v-model="auto"
  ></v-switch>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AutoRun',
  computed: {
    ...mapState('machineDashboard', ['autorun']),
    auto: {
      get() {
        return this.autorun;
      },
      set(val) {
        this.toggleAutorun(val);
      },
    },
  },
  methods: {
    ...mapMutations('machineDashboard', ['toggleAutorun']),
  },
};
</script>
