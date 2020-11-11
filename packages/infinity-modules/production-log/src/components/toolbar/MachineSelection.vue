<template>
  <v-combobox
    dense
    outlined
    label="Machine"
    v-model="machine"
    :items="machineList"
    prepend-inner-icon="mdi-crosshairs"
  ></v-combobox>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapState,
  mapActions,
} from 'vuex';

export default {
  name: 'MachineSelection',
  computed: {
    ...mapGetters('productionLog', ['machineList']),
    ...mapState('productionLog', ['selectedMachine']),
    machine: {
      get() {
        return this.selectedMachine;
      },
      set(val) {
        this.setSelectedMachine(val);
      },
    },
  },
  methods: {
    ...mapMutations('productionLog', ['setSelectedMachine']),
    ...mapActions('productionLog', ['fetchMachines']),
  },
  created() {
    if (this.machineList && this.machineList.length) {
      if (!this.selectedMachine) {
        this.setSelectedMachine(this.machineList[0]);
      }
    } else {
      this.fetchMachines();
    }
  },
  watch: {
    machineList(val) {
      if (val && val.length) {
        if (!this.selectedMachine) {
          this.setSelectedMachine(val[0]);
        }
      }
    },
  },
};
</script>
