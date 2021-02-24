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
  mapActions,
} from 'vuex';

const FIELD_NAME = 'machinename';

export default {
  name: 'MachineSelection',
  computed: {
    ...mapGetters('webApp', ['filters']),
    ...mapGetters('productionPlanning', ['machineList']),
    isMachineFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    machine: {
      get() {
        const machineFilter = this.filters && this.filters[FIELD_NAME];
        if (machineFilter) {
          return machineFilter.value;
        }
        return this.machineList[0];
      },
      set(machineVal) {
        this.setMachineFilter(machineVal);
      },
    },
  },
  created() {
    if (this.machineList && this.machineList.length) {
      if (this.isMachineFilterInactive) {
        this.setMachineFilter(this.machineList[0]);
      }
    } else {
      this.fetchMachines();
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    ...mapActions('productionPlanning', ['fetchMachines']),
    setMachineFilter(val) {
      this.setFilter({
        field: FIELD_NAME,
        value: {
          value: val,
          operation: 'eq',
        },
      });
    },
  },
  watch: {
    machineList(val) {
      if (val && val.length) {
        if (this.isMachineFilterInactive) {
          this.setMachineFilter(val[0]);
        }
      }
    },
  },
};
</script>
