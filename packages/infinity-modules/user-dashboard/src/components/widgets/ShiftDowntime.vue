<template>
  <v-card>
    <v-card-title>
      {{ $t('shiftDowntime') }}
    </v-card-title>
    <v-card-text v-if="downtimeLoading">
      <downtime-loading />
    </v-card-text>
    <v-card-text v-else-if="!downtimeLoading && !downtime">
      <downtime-no-records />
    </v-card-text>
    <v-card-text v-else>
      <div
        :key="i"
        :class="i !== 0 ? 'mt-8 mb-2' : 'mb-2'"
        class="headline font-weight-medium"
        v-for="(groupData, groupKey, i) in downtime"
      >
        <div class="primary--text">
          {{ groupKey }}
        </div>
        <v-data-table
          :items="groupData.values"
          :headers="headers"
          hide-default-footer
          item-key="_id"
          disable-pagination
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
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import DowntimeLoading from './downtime/DowntimeLoading.vue';
import DowntimeNoRecords from './downtime/DowntimeNoRecords.vue';
import AssignDowntime from './downtime/AssignDowntime.vue';

export default {
  name: 'ShiftDowntime',
  components: {
    DowntimeLoading,
    DowntimeNoRecords,
    AssignDowntime,
  },
  data() {
    return {
      headers: [
        { text: this.$t('machine'), value: 'machinename' },
        { text: this.$t('downtimeStart'), value: 'downtimestart' },
        { text: this.$t('downtimeEnd'), value: 'downtimeend' },
        {
          text: this.$t('reason'),
          value: 'reasonname',
          sortable: false,
          width: '30%',
        },
        {
          text: this.$t('isPlanned'),
          value: 'isPlanned',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState('userDashboard', ['downtimeLoading', 'thisShift']),
    ...mapGetters('userDashboard', ['downtime']),
  },
  methods: {
    inProgress(item) {
      return item.status === 'inProgress';
    },
  },
};
</script>
