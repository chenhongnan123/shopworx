<template>
  <v-chip
    label
    class="ml-4"
    :class="machineColor()"
  >
    {{ status }}
  </v-chip>
</template>

<script>
export default {
  name: 'SelectedMachineStatus',
  computed: {
    selectedMachine() {
      return this.$route.params.id;
    },
    status() {
      switch (this.selectedMachine) {
        case 'M1':
          return 'UP';
        case 'M2':
          return 'DOWN';
        case 'P1':
          return 'NO PLAN';
        case 'P2':
          return 'UP';
        default:
          return 'NO PLAN';
      }
    },
  },
  methods: {
    machineColor() {
      switch (this.status) {
        case 'UP':
          return 'success';
        case 'DOWN':
          return 'error';
        default:
          return 'info';
      }
    },
  },
};
</script>
