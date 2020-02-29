<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <v-row v-for="(holiday, index) in holidays" :key="index">
        <v-col cols="12" md="3">
          <v-text-field
            outlined
            v-model="holiday.name"
            hide-details
            type="text"
            label="Name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            outlined
            v-model="holiday.date"
            hide-details
            type="date"
            label="Date"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn icon class="mt-2 mx-2" @click="addHoliday">
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            class="mt-2 mx-2"
            @click="removeHoliday(index)"
            :disabled="holidays.length === 1"
          >
            <v-icon>mdi-minus-circle-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="saveHours"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.reviewData.buttons.continue')"
      >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'BusinessHolidays',
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      holidays: [{
        name: null,
        date: null,
      }],
    };
  },
  methods: {
    addHoliday() {
      this.holidays.push({
        name: null,
        date: null,
      });
    },
    removeHoliday(index) {
      this.holidays.splice(index, 1);
    },
    saveHours() {
      const records = this.holidays;
      const payload = {
        ...this.category,
        records,
      };
      this.$emit('holidays-provisioned', payload);
    },
  },
};
</script>
