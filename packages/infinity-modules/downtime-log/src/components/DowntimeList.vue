<template>
  <div style="height:100%">
    <template v-if="loading">
      <downtime-loading />
    </template>
    <template v-else-if="error">
      <downtime-error />
    </template>
    <template v-else-if="!error && downtimeList.length === 0">
      <downtime-no-records />
    </template>
    <template v-else>
      <div v-for="downtime in downtimeList" :key="downtime._id">
        <downtime-list-item :downtime="downtime" />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DowntimeLoading from './DowntimeLoading.vue';
import DowntimeError from './DowntimeError.vue';
import DowntimeNoRecords from './DowntimeNoRecords.vue';
import DowntimeListItem from './DowntimeListItem.vue';

export default {
  name: 'DowntimeList',
  components: {
    DowntimeLoading,
    DowntimeError,
    DowntimeNoRecords,
    DowntimeListItem,
  },
  computed: {
    ...mapState('downtimeLog', [
      'downtimeList',
      'loading',
      'error',
      'selectedMachine',
      'selectedShift',
      'selectedDate',
      'selectedDuration',
    ]),
  },
  methods: {
    ...mapActions('downtimeLog', ['fetchDowntimeList']),
  },
  watch: {
    selectedMachine(val) {
      if (val) {
        this.fetchDowntimeList();
      }
    },
    selectedShift(val) {
      if (val) {
        this.fetchDowntimeList();
      }
    },
    selectedDate(val) {
      if (val) {
        this.fetchDowntimeList();
      }
    },
    selectedDuration(val) {
      if (val) {
        this.fetchDowntimeList();
      }
    },
  },
};
</script>
