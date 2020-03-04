<template>
  <v-expansion-panels
    flat
    hover
    accordion
    v-model="panel"
  >
    <v-expansion-panel
      :key="index"
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
          v-if="index === 0"
          :category="step"
          @month-provisioned="onMonthProvisioned"
        />
        <business-working-days
          v-else-if="index === 1"
          :category="step"
          @days-provisioned="onDaysProvisioned"
        />
        <business-hours
          v-else-if="index === 2"
          :category="step"
          @hours-provisioned="onHoursProvisioned"
        />
        <business-holidays
          v-else-if="index === 3"
          :category="step"
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
    };
  },
  computed: {
    formSteps() {
      return this.categories.map((category) => ({
        ...category,
        icon: this.getIcon(category),
      }));
    },
  },
  methods: {
    ...mapActions('element', [
      'createElement',
      'createElementTags',
      'postBulkRecords',
      'postRecord',
    ]),
    ...mapActions('onboarding', ['completeOnboarding']),
    getIcon(category) {
      let icon = null;
      if (category) {
        switch (category.title) {
          case 'businessyear':
            icon = 'mdi-calendar-repeat-outline';
            break;
          case 'businessworkingdays':
            icon = 'mdi-calendar-range-outline';
            break;
          case 'businesshours':
            icon = 'mdi-timetable';
            break;
          case 'businessholidays':
            icon = 'mdi-beach';
            break;
          default:
            icon = null;
        }
      }
      return icon;
    },
    async onMonthProvisioned(data) {
      const {
        element,
        tags,
        record,
      } = data;
      const created = await this.createData(element, tags, record);
      if (created) {
        this.panel = 1;
      }
    },
    async onDaysProvisioned(data) {
      const {
        element,
        tags,
        records,
      } = data;
      const created = await this.createBulkData(element, tags, records);
      if (created) {
        this.panel = 2;
      }
    },
    async onHoursProvisioned(data) {
      const {
        element,
        tags,
        records,
      } = data;
      const created = await this.createBulkData(element, tags, records);
      if (created) {
        this.panel = 3;
      }
    },
    async onHolidaysProvisioned(data) {
      const {
        element,
        tags,
        records,
      } = data;
      const created = await this.createBulkData(element, tags, records);
      if (created) {
        const success = await this.completeOnboarding();
        if (success) {
          this.$router.replace({ name: 'home' });
        }
      }
    },
    async createData(element, tags, record) {
      let recordsPosted = false;
      const elementId = await this.createElement(element);
      if (elementId) {
        const tagsCreated = await this.createElementTags(tags);
        if (tagsCreated) {
          recordsPosted = await this.postRecord({
            elementName: element.elementName,
            payload: record,
          });
        }
      }
      return recordsPosted;
    },
    async createBulkData(element, tags, records) {
      let recordsPosted = false;
      const elementId = await this.createElement(element);
      if (elementId) {
        const tagsCreated = await this.createElementTags(tags);
        if (tagsCreated) {
          recordsPosted = await this.postBulkRecords({
            elementName: element.elementName,
            payload: records,
          });
        }
      }
      return recordsPosted;
    },
  },
};
</script>
