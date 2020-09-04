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
        <v-icon small left v-text="'$shiftHours'"></v-icon>
        {{ selectedShift ? selectedShift : '' }}
        <v-icon small right v-text="'mdi-chevron-down'"></v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        :key="n"
        v-for="(shift, n) in shiftList"
        @click="setSelectedShift(shift)"
      >
        <v-list-item-title>{{ shift }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapState,
  mapActions,
} from 'vuex';

export default {
  name: 'ShiftSelection',
  computed: {
    ...mapGetters('downtimeLog', ['shiftList']),
    ...mapState('downtimeLog', ['selectedShift']),
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedShift']),
    ...mapActions('downtimeLog', ['fetchShifts']),
  },
  created() {
    if (this.shiftList && this.shiftList.length) {
      if (!this.selectedShift) {
        this.setSelectedShift(this.shiftList[0]);
      }
    } else {
      this.fetchShifts();
    }
  },
  watch: {
    shiftList(val) {
      if (val && val.length) {
        if (!this.selectedShift) {
          this.setSelectedShift(val[0]);
        }
      }
    },
  },
};
</script>
