<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <v-btn-toggle
        dense
        multiple
        mandatory
        v-model="workingDays"
        color="primary"
      >
        <template v-for="(day, index) in days">
        <v-btn
          :key="index"
          class="text-none"
          v-text="$t(`onboarding.steps.calendar.days.${day}`)"
        ></v-btn>
        </template>
      </v-btn-toggle>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="saveWorkingDays"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.reviewData.buttons.continue')"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'BusinessWorkingDays',
  props: {
    tags: {
      type: Array,
      required: true,
    },
    records: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      workingDays: [1, 2, 3, 4, 5],
      days: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ],
    };
  },
  created() {
    this.setWorkingDays();
  },
  watch: {
    records() {
      this.setWorkingDays();
    },
  },
  methods: {
    setWorkingDays() {
      if (this.records && this.records.length) {
        this.workingDays = this.records
          .filter((rec) => rec.isWorking)
          .map((rec) => rec.day);
      }
    },
    saveWorkingDays() {
      const records = this.days.map((day, index) => {
        let isWorking = false;
        if (this.workingDays.includes(index)) {
          isWorking = true;
        }
        return {
          day: index,
          isWorking,
        };
      });
      this.$emit('days-provisioned', records);
    },
  },
};
</script>
