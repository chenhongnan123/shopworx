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
      <div v-for="(downtime, n) in downtimeList" :key="n">
        <downtime-list-item
          :downtime="downtime"
          class="mb-2 mx-4"
        />
      </div>
      <downtime-load-more />
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import DowntimeLoading from './DowntimeLoading.vue';
import DowntimeError from './DowntimeError.vue';
import DowntimeNoRecords from './DowntimeNoRecords.vue';
import DowntimeListItem from './DowntimeListItem.vue';
import DowntimeLoadMore from './DowntimeLoadMore.vue';

export default {
  name: 'DowntimeList',
  components: {
    DowntimeLoading,
    DowntimeError,
    DowntimeNoRecords,
    DowntimeListItem,
    DowntimeLoadMore,
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
      'selectedType',
      'selectedSort',
      'selectedStatus',
    ]),
  },
  methods: {
    ...mapMutations('downtimeLog', ['resetPageNumber', 'setDowntimeList']),
    ...mapActions('downtimeLog', ['fetchDowntimeList']),
  },
  watch: {
    selectedMachine(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
    selectedShift(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
    selectedDate(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
    selectedDuration(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
    selectedType(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
    selectedSort(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
    selectedStatus(val) {
      if (val) {
        this.resetPageNumber();
        this.setDowntimeList([]);
        this.fetchDowntimeList();
      }
    },
  },
};
</script>
