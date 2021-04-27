<template>
  <v-select
    dense
    outlined
    item-value="value"
    item-text="name"
    :label="$t('downtime.shift')"
    v-model="shift"
    :items="shifts"
    prepend-inner-icon="$shiftHours"
  ></v-select>
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
    shifts() {
      let shifts = [];
      if (this.shiftList && this.shiftList.length) {
        shifts = [{
          name: this.$t('downtime.allShifts'),
          value: 'All',
        }, ...this.shiftList];
      }
      return shifts;
    },
    shift: {
      get() {
        const shiftFilter = this.filters && this.filters[FIELD_NAME];
        if (shiftFilter) {
          return shiftFilter.value;
        }
        return this.shifts && this.shifts.length && this.shifts[0].value;
      },
      set(shiftVal) {
        this.setShiftFilter(shiftVal);
      },
    },
  },
  created() {
    if (this.shifts && this.shifts.length) {
      if (this.isShiftFilterInactive) {
        this.setShiftFilter(this.shifts[0].value);
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
    shifts(val) {
      if (val && val.length) {
        if (this.isShiftFilterInactive) {
          this.setShiftFilter(val[0].value);
        }
      }
    },
  },
};
</script>
