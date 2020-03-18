<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <p
        class="mt-1 text-justify"
        v-text="$t('onboarding.steps.calendar.businessHoursNote')"
      ></p>
      <v-row v-for="(routine, index) in routines" :key="index">
        <v-col cols="12" md="2">
          <v-select
            outlined
            v-model="routine.type"
            :items="items"
            item-text="text"
            item-value="value"
            hide-details
            label="Type"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4" v-if="routine.type === 'shift'">
          <v-text-field
            outlined
            v-model="routine.name"
            hide-details
            type="text"
            label="Name"
          ></v-text-field>
        </v-col>
        <template v-else>
          <v-col cols="12" md="3">
            <v-text-field
              outlined
              v-model="routine.name"
              hide-details
              type="text"
              label="Name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="1">
            <v-select
              outlined
              v-model="routine.shift"
              :items="shifts"
              hide-details
              label="Shift name"
            ></v-select>
          </v-col>
        </template>
        <v-col cols="12" md="2">
          <v-text-field
            outlined
            v-model="routine.starttime"
            hide-details
            type="time"
            label="Start time"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            outlined
            v-model="routine.endtime"
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
import { getDurationBetweenTime } from '@shopworx/services/util/date.service';

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
        shift: 'Shift 1',
        duration: null,
        starttime: '08:00',
        endtime: '14:00',
      }],
    };
  },
  computed: {
    shifts() {
      let shifts = [];
      if (this.routines && this.routines.length) {
        const shiftMap = this.routines
          .filter((r) => r.type === 'shift' && r.name)
          .map((r) => r.name);
        shifts = [...new Set(shiftMap)];
      }
      return shifts;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    addRoutine() {
      this.routines.push({
        type: 'shift',
        name: null,
        shift: null,
        duration: null,
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
      let actualMins = null;
      let actualHour = null;
      if (mins !== '00') {
        actualMins = (parseInt(mins, 10) - 1).toString().length === 1
          ? `0${parseInt(mins, 10) - 1}`
          : parseInt(mins, 10) - 1;
      } else {
        actualMins = '59';
      }
      if (mins === '00') {
        actualHour = (parseInt(hours, 10) - 1).toString().length === 1
          ? `0${parseInt(hours, 10) - 1}`
          : parseInt(hours, 10) - 1;
      } else {
        actualHour = (parseInt(hours, 10)).toString().length === 1
          ? `0${parseInt(hours, 10)}`
          : parseInt(hours, 10);
      }
      if (actualHour === -1) {
        actualHour = 23;
      }
      const actualTime = [actualHour, actualMins, actualSecs];
      return actualTime.join(':');
    },
    isValidDate(d) {
      return d instanceof Date && !Number.isNaN(d.getTime());
    },
    isInvalidHour() {
      return this.routines.some((routine) => {
        const timeStart = new Date(`1970-01-01T${routine.starttime}Z`);
        const timeEnd = new Date(`1970-01-01T${routine.endtime}Z`);
        return !this.isValidDate(timeStart)
          || !this.isValidDate(timeEnd);
      });
    },
    isHourMissing() {
      return this.routines.some((routine, index) => (
        index !== this.routines.length - 1
        && routine.endtime !== this.routines[index + 1].starttime
      ));
    },
    isSumInvalid() {
      const sum = this.routines.reduce((acc, cur) => acc + (this.getDuration(cur) || 0), 0);
      return !!sum;
    },
    isEmptyName(records) {
      return records.some((routine) => !routine.name);
    },
    isEmptyShift(records) {
      return records.some((routine) => !routine.shift);
    },
    saveHours() {
      const records = this.routines.map((routine) => ({
        ...routine,
        shift: routine.type === 'shift' ? routine.name : routine.shift,
        duration: getDurationBetweenTime(routine.endtime, routine.starttime),
        starttime: this.getStartTime(routine.starttime),
        endtime: this.getEndTime(routine.endtime),
      }));
      if (this.isEmptyName(records)) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'HOUR_NAME_REQUIRED',
        });
      } else if (this.isEmptyShift(records)) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'HOUR_SHIFT_REQUIRED',
        });
      } else if (this.isInvalidHour()) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INVALID_HOUR',
        });
      } else if (this.isHourMissing()) {
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
