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
  mapActions,
} from 'vuex';

const FIELD_NAME = 'shiftName';

export default {
  name: 'ShiftSelection',
  computed: {
    ...mapGetters('webApp', ['filters']),
    ...mapGetters('downtimeLog', ['shiftList']),
    isShiftFilterInactive() {
      return !Object
        .keys(this.filters)
        .includes(FIELD_NAME);
    },
    shift: {
      get() {
        const shiftFilter = this.filters && this.filters[FIELD_NAME];
        if (shiftFilter) {
          return shiftFilter.value;
        }
        return this.shiftList[0];
      },
      set(shiftVal) {
        this.setShiftFilter(shiftVal);
      },
    },
  },
  created() {
    if (this.shiftList && this.shiftList.length) {
      if (this.isShiftFilterInactive) {
        this.setShiftFilter(this.shiftList[0]);
      }
    } else {
      this.fetchShifts();
    }
  },
  methods: {
    ...mapMutations('webApp', ['setFilter']),
    ...mapActions('downtimeLog', ['fetchShifts']),
    setShiftFilter(val) {
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
    shiftList(val) {
      if (val && val.length) {
        if (this.isShiftFilterInactive) {
          this.setShiftFilter(val[0]);
        }
      }
    },
  },
};
</script>
