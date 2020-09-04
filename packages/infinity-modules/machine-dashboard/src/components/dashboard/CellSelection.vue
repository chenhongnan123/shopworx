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
        {{ selectedCell ? selectedCell.name : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(cell, n) in cells"
        @click="setSelectedCell(cell)"
      >
        <v-list-item-title>{{ cell.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'CellSelection',
  computed: {
    ...mapGetters('machineDashboard', ['cells']),
    ...mapState('machineDashboard', ['selectedCell']),
  },
  methods: {
    ...mapMutations('machineDashboard', ['setSelectedCell']),
  },
  created() {
    if (this.cells && this.cells.length) {
      if (!this.selectedCell) {
        this.setSelectedCell(this.cells[0]);
      }
    }
  },
  watch: {
    cells(val) {
      if (val && val.length) {
        if (!this.selectedCell) {
          this.setSelectedCell(val[0]);
        }
      }
    },
  },
};
</script>
