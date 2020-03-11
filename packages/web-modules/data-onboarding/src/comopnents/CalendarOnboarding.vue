<template>
  <v-expansion-panels
    flat
    hover
    accordion
    v-model="panel"
  >
    <v-expansion-panel
      :key="index"
      :disabled="loading || panel < index"
      v-for="(step, index) in formSteps"
    >
      <v-expansion-panel-header>
        <span>
          <v-icon v-text="step.icon"></v-icon>
          <span
            class="ml-2"
            v-text="$t(`onboarding.steps.calendar.${step.title}`)"
          ></span>
        </span>
      </v-expansion-panel-header>
      <v-expansion-panel-content class="mt-1">
        <business-month-start
          :category="step"
          :loading="loading"
          v-if="index === 0"
          @month-provisioned="onMonthProvisioned"
        />
        <business-working-days
          :category="step"
          :loading="loading"
          v-else-if="index === 1"
          @days-provisioned="onDaysProvisioned"
        />
        <business-hours
          :category="step"
          :loading="loading"
          v-else-if="index === 2"
          @hours-provisioned="onHoursProvisioned"
        />
        <business-holidays
          :category="step"
          :loading="loading"
          v-else-if="index === 3"
          @holidays-provisioned="onHolidaysProvisioned"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { mapActions } from 'vuex';
import BusinessMonthStart from './calendar/BusinessMonthStart.vue';
import BusinessWorkingDays from './calendar/BusinessWorkingDays.vue';
import BusinessHours from './calendar/BusinessHours.vue';
import BusinessHolidays from './calendar/BusinessHolidays.vue';

export default {
  name: 'CalendarOnboarding',
  components: {
    BusinessMonthStart,
    BusinessWorkingDays,
    BusinessHours,
    BusinessHolidays,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      panel: 0,
      loading: false,
    };
  },
  computed: {
    formSteps() {
      return this.categories.map((category) => ({
        ...category,
        icon: `$${category.title}`,
      }));
    },
  },
  methods: {
    ...mapActions('element', [
      'upsertRecord',
      'upsertBulkRecords',
    ]),
    ...mapActions('onboarding', ['completeOnboarding']),
    async onMonthProvisioned(data) {
      this.loading = true;
      const created = await this.upsertRecord(data);
      if (created) {
        this.panel = 1;
      }
      this.loading = false;
    },
    async onDaysProvisioned(data) {
      this.loading = true;
      const created = await this.upsertBulkRecords(data);
      if (created) {
        this.panel = 2;
      }
      this.loading = false;
    },
    async onHoursProvisioned(data) {
      this.loading = true;
      const created = await this.upsertBulkRecords(data);
      if (created) {
        this.panel = 3;
      }
      this.loading = false;
    },
    async onHolidaysProvisioned(data) {
      this.loading = true;
      const created = await this.upsertBulkRecords(data);
      if (created) {
        const success = await this.completeOnboarding();
        if (success) {
          this.$router.replace({ name: 'home' });
        }
      }
      this.loading = false;
    },
  },
};
</script>
