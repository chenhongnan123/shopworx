<template>
  <v-checkbox
    class="ma-0"
    label="Select all"
    v-model="checkbox"
    :indeterminate="indeterminate"
    v-show="toggleSelection"
    ></v-checkbox>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'SelectAll',
  data() {
    return {
      selectAll: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', [
      'downtimeCount',
      'selectedDowntimes',
      'toggleSelection',
    ]),
    checkbox: {
      get() {
        return this.selectedDowntimes.length !== 0;
      },
      set(val) {
        if (val) {
          this.setSelectAllDowntimes();
        } else {
          this.setSelectAllDowntimes([]);
        }
        this.selectAll = val;
      },
    },
    indeterminate() {
      return this.selectedDowntimes.length !== 0
        && this.selectedDowntimes.length < this.downtimeCount;
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectAllDowntimes']),
  },
};
</script>
