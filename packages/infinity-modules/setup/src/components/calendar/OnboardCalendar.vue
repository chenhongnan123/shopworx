<template>
  <v-card flat class="transparent">
    <template v-if="fetching">
      <v-progress-circular indeterminate></v-progress-circular>
      <span>
        Fetching calendar data from ShopWorx servers
      </span>
    </template>
    <template v-else-if="error">
      We couldn't fetch calendar data from ShopWorx servers.
      Please
      <a
        @click="fetchCalendar"
        class="primary--text font-weight-medium"
      >
        retry.
      </a>
    </template>
    <v-window
      v-else
      v-model="window"
    >
      <v-window-item :value="0">
        <business-start-month
          :loading="loading"
          :master="calendarData"
          @save="onMonthProvisioned"
        />
      </v-window-item>
      <v-window-item :value="1">
        <business-working-days
          :loading="loading"
          :master="calendarData"
          @save="onDaysProvisioned"
        />
      </v-window-item>
      <v-window-item :value="2">
        <business-hours
          :loading="loading"
          :master="calendarData"
          @save="onHoursProvisioned"
        />
      </v-window-item>
      <v-window-item :value="3">
        <business-holidays
          :loading="loading"
          :master="calendarData"
          @skip="updateStep"
          @save="onHolidaysProvisioned"
        />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import BusinessStartMonth from './BusinessStartMonth.vue';
import BusinessWorkingDays from './BusinessWorkingDays.vue';
import BusinessHours from './BusinessHours.vue';
import BusinessHolidays from './BusinessHolidays.vue';

export default {
  name: 'OnboardCalendar',
  components: {
    BusinessStartMonth,
    BusinessWorkingDays,
    BusinessHours,
    BusinessHolidays,
  },
  data() {
    return {
      window: 0,
      error: false,
      loading: false,
      fetching: false,
    };
  },
  computed: {
    ...mapState('setup', ['calendarData']),
  },
  created() {
    this.fetchCalendar();
  },
  methods: {
    ...mapActions('setup', ['getCalendarData']),
    ...mapActions('element', ['upsertRecord', 'upsertBulkRecords']),
    async fetchCalendar() {
      this.fetching = true;
      const success = await this.getCalendarData();
      if (success) {
        this.masterList = this.calendarData;
      }
      this.error = !success;
      this.fetching = false;
    },
    async onMonthProvisioned(data) {
      this.loading = true;
      const created = await this.upsertRecord(data);
      if (created) {
        this.window = 1;
      }
      this.loading = false;
    },
    async onDaysProvisioned(data) {
      this.loading = true;
      const created = await this.upsertBulkRecords(data);
      if (created) {
        this.window = 2;
      }
      this.loading = false;
    },
    async onHoursProvisioned(data) {
      this.loading = true;
      const created = await this.upsertBulkRecords(data);
      if (created) {
        this.window = 3;
      }
      this.loading = false;
    },
    async onHolidaysProvisioned(data) {
      this.loading = true;
      const created = await this.upsertBulkRecords(data);
      if (created) {
        this.$emit('update-step');
      }
      this.loading = false;
    },
    updateStep() {
      this.$emit('update-step');
    },
  },
};
</script>
