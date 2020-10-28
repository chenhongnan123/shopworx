<template>
  <v-combobox
    dense
    outlined
    label="Shift"
    v-model="shift"
    :items="shiftList"
    prepend-inner-icon="$shiftHours"
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
  name: 'ShiftSelection',
  computed: {
    ...mapGetters('productionLog', ['shiftList']),
    ...mapState('productionLog', ['selectedShift']),
    shift: {
      get() {
        return this.selectedShift;
      },
      set(val) {
        this.setSelectedShift(val);
      },
    },
  },
  methods: {
    ...mapMutations('productionLog', ['setSelectedShift']),
    ...mapActions('productionLog', ['fetchShifts']),
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
