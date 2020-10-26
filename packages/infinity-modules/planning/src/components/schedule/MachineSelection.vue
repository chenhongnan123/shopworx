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
        :loading="loading"
        class="text-none ml-2"
      >
        <v-icon small left v-text="'$production'"></v-icon>
        {{ machine ? machine.machinename : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="machine._id"
        v-for="machine in machines"
        @click="onSetMachine(machine)"
      >
        <v-list-item-title>{{ machine.machinename }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  name: 'MachineSelection',
  data() {
    return {
      machines: [],
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    const machines = await this.getRecords({
      elementName: 'machine',
    });
    this.machines = sortArray(machines, 'machinename');
    this.onSetMachine(this.machines[0]);
    this.loading = false;
  },
  computed: {
    ...mapState('planning', ['machine']),
  },
  methods: {
    ...mapActions('element', ['getRecords']),
    ...mapMutations('planning', ['setMachine']),
    onSetMachine(machine) {
      this.setMachine(machine);
      this.$emit('selected');
    },
  },
};
</script>
