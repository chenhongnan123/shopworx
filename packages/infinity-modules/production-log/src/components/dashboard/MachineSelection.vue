<template>
  <v-menu
    bottom
    offset-y
  >
    <template #activator="{ on }">
      <v-btn
        small
        outlined
        v-on="on"
        color="primary"
        class="text-none ml-2"
      >
        <v-icon small left v-text="'mdi-crosshairs'"></v-icon>
        {{ selectedMachine ? selectedMachine : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(machine, n) in machineList"
        @click="setSelectedMachine(machine)"
      >
        <v-list-item-title>{{ machine }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'MachineSelection',
  computed: {
    ...mapGetters('productionLog', ['machineList']),
    ...mapState('productionLog', ['selectedMachine']),
  },
  methods: {
    ...mapMutations('productionLog', ['setSelectedMachine']),
  },
  created() {
    if (this.machineList && this.machineList.length) {
      if (!this.selectedMachine) {
        this.setSelectedMachine(this.machineList[0]);
      }
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
