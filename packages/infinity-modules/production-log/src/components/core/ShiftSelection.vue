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
        {{ selectedShift ? selectedShift : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(shift, n) in shifts"
        @click="setSelectedShift(shift)"
      >
        <v-list-item-title>{{ shift }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'ShiftSelection',
  computed: {
    ...mapGetters('productionLog', ['shifts']),
    ...mapState('productionLog', ['selectedShift']),
  },
  methods: {
    ...mapMutations('productionLog', ['setSelectedShift']),
  },
  created() {
    if (this.shifts && this.shifts.length) {
      if (!this.selectedShift) {
        this.setSelectedShift(this.shifts[0]);
      }
    }
  },
  watch: {
    shifts(val) {
      if (val && val.length) {
        if (!this.selectedShift) {
          this.setSelectedShift(val[0]);
        }
      }
    },
  },
};
</script>
