<template>
  <v-select
    dense
    outlined
    item-value="value"
    item-text="name"
    v-if="isMobile"
    :label="$t('planning.machine')"
    v-model="machine"
    :items="machines"
    prepend-inner-icon="mdi-crosshairs"
  ></v-select>
  <v-autocomplete
    dense
    v-else
    outlined
    item-value="value"
    item-text="name"
    :label="$t('planning.machine')"
    v-model="machine"
    :items="machines"
    prepend-inner-icon="mdi-crosshairs"
  ></v-autocomplete>
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
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    machines() {
      let machines = [];
      if (this.machineList && this.machineList.length) {
        machines = [{
          name: this.$t('planning.allMachines'),
          value: 'All',
        }, ...this.machineList];
      }
      return machines;
    },
    machine: {
      get() {
        const machineFilter = this.filters && this.filters[FIELD_NAME];
        if (machineFilter) {
          return machineFilter.value;
        }
        return this.machines && this.machines.length && this.machines[0].value;
      },
      set(machineVal) {
        this.setMachineFilter(machineVal);
      },
    },
  },
  created() {
    if (this.machines && this.machines.length) {
      if (this.isMachineFilterInactive) {
        this.setMachineFilter(this.machines[0].value);
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
    machines(val) {
      if (val && val.length) {
        if (this.isMachineFilterInactive) {
          this.setMachineFilter(val[0].value);
        }
      }
    },
  },
};
</script>
