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
        />
        <business-working-days
          v-else-if="index === 1"
        />
        <business-hours
          v-else-if="index === 2"
        />
        <business-holidays
          v-else-if="index === 2"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
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
    onDataImport(data) {
      this.importedData = data;
      this.dataImported = true;
      this.panel = 1;
    },
    onColumnsMatched(data) {
      this.matchedColumns = data;
      this.columnsMatched = true;
      this.panel = 2;
    },
    onDataReviewed(data) {
      console.log(data);
      this.tagsToProvision = data.tags;
      this.dataToProvision = data.data;
      // Move to next omnboarding item or next asset item
    },
  },
};
</script>
