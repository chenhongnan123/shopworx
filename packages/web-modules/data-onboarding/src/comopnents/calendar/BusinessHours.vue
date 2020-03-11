<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <p
        class="mt-1 text-justify"
        v-text="$t('onboarding.steps.calendar.businessHoursNote')"
      ></p>
      <v-row v-for="(rountine, index) in routines" :key="index">
        <v-col cols="12" md="3">
          <v-select
            outlined
            v-model="rountine.type"
            :items="items"
            item-text="text"
            item-value="value"
            hide-details
            label="Type"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            outlined
            v-model="rountine.name"
            hide-details
            type="text"
            label="Name"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            outlined
            v-model="rountine.starttime"
            hide-details
            type="time"
            label="Start time"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            outlined
            v-model="rountine.endtime"
            hide-details
            type="time"
            label="End time"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-btn icon class="mt-2 mx-2" @click="addRoutine">
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            class="mt-2 mx-2"
            @click="removeRoutine(index)"
            :disabled="routines.length === 1"
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
        :loading="loading"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
      >
        {{ $t('onboarding.reviewData.buttons.continue') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'BusinessHours',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('onboarding.steps.calendar.shift'),
          value: 'shift',
        },
        {
          text: this.$i18n.t('onboarding.steps.calendar.break'),
          value: 'break',
        }],
      routines: [{
        type: 'shift',
        name: 'Shift 1',
        starttime: '08:00',
        endtime: '14:00',
      }],
    };
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    addRoutine() {
      this.routines.push({
        type: 'shift',
        name: null,
        starttime: null,
        endtime: null,
      });
    },
    removeRoutine(index) {
      this.routines.splice(index, 1);
    },
    getStartTime(time) {
      return `${time}:00`;
    },
    getDuration({ endtime, starttime }) {
      const timeStart = new Date(`01/01/2007 ${starttime}`).getHours();
      const timeEnd = new Date(`01/01/2007 ${endtime}`).getHours();
      return timeEnd - timeStart;
    },
    getEndTime(time) {
      const [hours, mins] = time.split(':');
      const actualSecs = '59';
      const actualMins = mins !== '00' ? parseInt(mins, 10) - 1 : '59';
      let actualHour = mins !== '00' ? parseInt(hours, 10) : parseInt(hours, 10) - 1;
      if (actualHour === -1) {
        actualHour = 23;
      }
      const actualTime = [actualHour, actualMins, actualSecs];
      return actualTime.join(':');
    },
    isHourMissing() {
      return this.routines.some((routine, index) => (
        index !== this.routines.length - 1
        && routine.endtime !== this.routines[index + 1].starttime
      ));
    },
    isSumInvalid() {
      const sum = this.routines.reduce((acc, cur) => acc + (this.getDuration(cur) || 0), 0);
      console.log(!!sum);
      return !!sum;
    },
    saveHours() {
      if (this.isHourMissing()) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MISSING_BUSINESS_HOUR',
        });
      } else if (this.isSumInvalid()) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INVALID_HOURS_SUM',
        });
      } else {
        const records = this.routines.map((routine) => ({
          ...routine,
          starttime: this.getStartTime(routine.starttime),
          endtime: this.getEndTime(routine.endtime),
        }));
        const payload = {
          ...this.category,
          records,
        };
        this.$emit('hours-provisioned', payload);
      }
    },
  },
};
</script>
