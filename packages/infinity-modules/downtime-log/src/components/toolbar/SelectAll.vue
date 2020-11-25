<template>
  <v-checkbox
    class="ma-0"
    label="Select all"
    v-model="isSelectAll"
    @click="onSelectAllChange"
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
      isSelectAll: false,
    };
  },
  computed: {
    ...mapState('downtimeLog', [
      'downtimeList',
      'selectedDowntimes',
      'toggleSelection',
    ]),
    indeterminate() {
      return this.selectedDowntimes.length !== 0
        && this.selectedDowntimes.length < this.downtimeList.length;
    },
  },
  methods: {
    ...mapMutations('downtimeLog', ['setSelectedDowntimes']),
    onSelectAllChange() {
      this.setSelectedDowntimes([]);
      if (this.isSelectAll) {
        this.setSelectedDowntimes(this.downtimeList);
      }
    },
  },
};
</script>
