<template>
  <div style="height:100%">
    <template v-if="loading">
      <downtime-loading />
    </template>
    <template v-else-if="error">
      <downtime-error />
    </template>
    <template v-else-if="!error && !downtime">
      <downtime-no-records />
    </template>
    <template v-else>
      <div
        :key="i"
        :class="i !== 0 ? 'mt-8 mb-2' : 'mb-2'"
        class="headline ml-4 font-weight-medium"
        v-for="(groupData, groupKey, i) in downtime"
      >
        <div class="primary--text">
          {{ groupKey }}
        </div>
        <v-data-table
          v-model="selected"
          :items="groupData.values"
          :headers="headers"
          hide-default-footer
          item-key="_id"
          :show-select="toggleSelection"
        >
          <!-- eslint-disable-next-line -->
          <template #item.downtimestart="{ item }">
            {{ new Date(item.downtimestart).toLocaleTimeString('en-GB') }}
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.downtimeend="{ item }">
            <span v-if="!inProgress(item)">
              {{ new Date(item.downtimeend).toLocaleTimeString('en-GB') }}
            </span>
            <span v-else>-</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.downtimeduration="{ item }">
            <span v-if="!inProgress(item)">
              {{ duration(item) }}
            </span>
            <span v-else>-</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.reasonname="{ item }">
            <assign-downtime :downtime="item" />
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.isPlanned="{ item }">
            <v-icon
              v-if="item.isBreak"
              v-text="'$downtime'"
              color="accent"
              :title="item.breakName"
            ></v-icon>
            <v-icon
              v-if="item.isHoliday"
              v-text="'$holidays'"
              color="accent"
              :title="item.holidayName"
            ></v-icon>
            <span v-if="!item.isBreak && !item.isHoliday">-</span>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item.action="{ item }">
            <downtime-split
              :downtime="item"
              :duration="duration(item)"
              :inProgress="inProgress(item)"
            />
          </template>
        </v-data-table>
      </div>
    </template>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import DowntimeLoading from './DowntimeLoading.vue';
import DowntimeError from './DowntimeError.vue';
import DowntimeNoRecords from './DowntimeNoRecords.vue';
import DowntimeSplit from './DowntimeSplit.vue';
import AssignDowntime from './AssignDowntime.vue';

export default {
  name: 'DowntimeList',
  components: {
    DowntimeLoading,
    DowntimeError,
    DowntimeNoRecords,
    DowntimeSplit,
    AssignDowntime,
  },
  data() {
    return {
      headers: [
        { text: 'Machine', value: 'machinename' },
        { text: 'Downtime start', value: 'downtimestart' },
        { text: 'Downtime end', value: 'downtimeend' },
        { text: 'Duration', value: 'downtimeduration' },
        {
          text: 'Reason',
          value: 'reasonname',
          sortable: false,
          width: '30%',
        },
        {
          text: 'Is planned',
          value: 'isPlanned',
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('downtimeLog', [
      'loading',
      'error',
      'selectedDowntimes',
      'toggleSelection',
    ]),
    ...mapGetters('downtimeLog', ['downtime']),
    selected: {
      get() {
        return this.selectedDowntimes;
      },
      set(val) {
        this.setSelectedDowntimes(val);
      },
    },
  },
  methods: {
    ...mapActions('downtimeLog', ['fetchDowntimeList']),
    ...mapMutations('downtimeLog', ['setSelectedDowntimes']),
    duration(item) {
      const d = item.downtimeduration;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
    },
    inProgress(item) {
      return item.status === 'inProgress';
    },
  },
  created() {
    this.fetchDowntimeList();
  },
};
</script>
