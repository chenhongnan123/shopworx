<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
          :loading="saving"
          @click="save"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          Save
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="fetchRecords"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
      </span>
    </portal>
    <v-progress-circular
      indeterminate
      v-if="loading"
    ></v-progress-circular>
    <validation-observer #default="{ passes }" v-else>
      <v-form @submit.prevent="passes(save)">
        <v-card
          flat
          :key="index"
          class="mb-2 transparent"
          v-for="(hour, index) in hours"
        >
          <v-row>
            <v-col cols="4">
              <validation-provider
                name="type"
                rules="required"
                vid="hourType"
                #default="{ errors }"
              >
                <v-select
                  :items="items"
                  item-text="text"
                  item-value="value"
                  hide-details="auto"
                  v-model="hour.type"
                  :id="`type-${index}`"
                  :error-messages="errors"
                  :prepend-icon="hour.type === 'shift'
                    ? '$shift'
                    : '$break'"
                  :label="$t('setup.onboardCalendar.hours.type')"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="8" v-if="hour.type === 'shift'">
              <validation-provider
                name="name"
                rules="required_if:hourType,shift"
                #default="{ errors }"
              >
                <v-text-field
                  type="text"
                  v-model="hour.name"
                  hide-details="auto"
                  :id="`name-${index}`"
                  :error-messages="errors"
                  :label="$t('setup.onboardCalendar.hours.name')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="hour.type === 'break'">
              <validation-provider
                name="name"
                rules="required_if:hourType,break"
                #default="{ errors }"
              >
                <v-text-field
                  type="text"
                  v-model="hour.name"
                  hide-details="auto"
                  :id="`name-${index}`"
                  :error-messages="errors"
                  :label="$t('setup.onboardCalendar.hours.name')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="hour.type === 'break'">
              <validation-provider
                name="shift"
                rules="required_if:hourType,break"
                #default="{ errors }"
              >
                <v-select
                  :items="shifts"
                  hide-details="auto"
                  v-model="hour.shift"
                  :id="`shift-${index}`"
                  :error-messages="errors"
                  :label="$t('setup.onboardCalendar.hours.includeIn')"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                rules="required"
                name="startTime"
                #default="{ errors }"
              >
                <v-text-field
                  type="time"
                  hide-details="auto"
                  v-model="hour.starttime"
                  :error-messages="errors"
                  :id="`starttime-${index}`"
                  :label="$t('setup.onboardCalendar.hours.startTime')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                name="endTime"
                rules="required"
                #default="{ errors }"
              >
                <v-text-field
                  type="time"
                  hide-details="auto"
                  v-model="hour.endtime"
                  :error-messages="errors"
                  :id="`endtime-${index}`"
                  :label="$t('setup.onboardCalendar.hours.endTime')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="my-auto">
              <v-btn
                icon
                small
                class="mx-2"
                @click="addHour"
                :id="`add-${index}`"
              >
                <v-icon v-text="'$add'"></v-icon>
              </v-btn>
              <v-btn
                icon
                small
                class="pa-0"
                :id="`remove-${index}`"
                @click="removeHour(index)"
                :disabled="hours.length === 1"
              >
                <v-icon v-text="'$remove'"></v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="index + 1 != hours.length"></v-divider>
        </v-card>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { getDurationBetweenTime } from '@shopworx/services/util/date.service';

export default {
  name: 'BusinessHours',
  data() {
    return {
      loading: false,
      saving: false,
      items: [{
        text: this.$i18n.t('setup.onboardCalendar.hours.shift'),
        value: 'shift',
      },
      {
        text: this.$i18n.t('setup.onboardCalendar.hours.break'),
        value: 'break',
      }],
      hours: [{
        type: 'shift',
        name: '',
        starttime: '',
        endtime: '',
      }],
    };
  },
  computed: {
    shifts() {
      let shifts = [];
      if (this.hours && this.hours.length) {
        const shiftMap = this.hours
          .filter((r) => r.type === 'shift' && r.name)
          .map((r) => r.name);
        shifts = [...new Set(shiftMap)];
      }
      return shifts;
    },
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('element', ['getRecords', 'upsertBulkRecords']),
    async fetchRecords() {
      this.loading = true;
      const records = await this.getRecords({
        elementName: 'businesshours',
      });
      if (records && records.length) {
        this.hours = records
          .map((rec) => ({
            type: rec.type,
            name: rec.name,
            shift: rec.shift,
            starttime: rec.starttime,
            endtime: rec.endtime,
            sortindex: rec.sortindex,
          }))
          .sort((a, b) => a.sortindex - b.sortindex);
      }
      this.loading = false;
    },
    isHourMissing() {
      return this.hours.some((hour, index) => (
        index !== this.hours.length - 1
        && hour.endtime !== this.hours[index + 1].starttime
      ));
    },
    isSumInvalid() {
      const sum = this.hours.reduce((acc, cur) => acc + getDurationBetweenTime(
        cur.endtime,
        cur.starttime,
      ), 0);
      return sum !== 86400000;
    },
    addHour() {
      this.hours.push({
        type: 'shift',
        name: '',
        starttime: '',
        endtime: '',
      });
    },
    removeHour(index) {
      this.hours.splice(index, 1);
    },
    getDurationInAnHour(hourStart, hourEnd, shiftStart, shiftEnd) {
      let time = 0;
      if (hourStart >= shiftStart && hourEnd <= shiftEnd) {
        time = hourEnd - hourStart;
      } else if (hourStart <= shiftStart && hourEnd >= shiftEnd) {
        time = shiftEnd - shiftStart;
      } else if (hourStart > shiftStart && hourStart < shiftEnd) {
        time = shiftEnd - hourStart;
      } else if (hourEnd > shiftStart && hourEnd < shiftEnd) {
        time = hourEnd - shiftStart;
      }
      return time;
    },
    async saveHourlyAvailableTime(records) {
      let hours = [];
      for (let i = 0; i < 24; i += 1) {
        const start = i === 0
          ? new Date(`01/01/2007 ${records[0].starttime}`).getTime()
          : hours[i - 1].end;
        hours.push({
          sortindex: i,
          start,
          end: start + 3600000,
        });
      }
      const shifts = [];
      records.forEach((record, i) => {
        const start = i === 0
          ? new Date(`01/01/2007 ${record.starttime}`).getTime()
          : shifts[i - 1].end;
        shifts.push({
          type: record.type,
          duration: record.duration,
          start,
          end: start + record.duration,
        });
      });
      hours = hours.map((hour) => {
        const startString = `${`${new Date(hour.start).getHours()}`.padStart(2, '0')}:${`${new Date(hour.start).getMinutes()}`.padStart(2, '0')}`;
        const endString = `${`${new Date(hour.end).getHours()}`.padStart(2, '0')}:${`${new Date(hour.end).getMinutes()}`.padStart(2, '0')}`;
        const availabletime = shifts
          .filter((shift) => shift.type === 'shift')
          .reduce((a, c) => {
            const time = this.getDurationInAnHour(
              hour.start,
              hour.end,
              c.start,
              c.end,
            );
            return a + time;
          }, 0);
        const breaktime = shifts
          .filter((shift) => shift.type === 'break')
          .reduce((a, c) => {
            const time = this.getDurationInAnHour(
              hour.start,
              hour.end,
              c.start,
              c.end,
            );
            return a + time;
          }, 0);
        return {
          sortindex: hour.sortindex,
          displayhour: `${startString} - ${endString}`,
          availabletimeinms: availabletime,
          breaktimeinms: breaktime,
          totaltimeinms: 3600000,
        };
      });
      const payload = {
        elementName: 'hourlyavailabletime',
        records: hours,
      };
      await this.upsertBulkRecords(payload);
    },
    async saveShiftWiseAvailableTime(records) {
      let index = 0;
      let shifts = records.reduce((a, c) => {
        const prev = a.get(c.shift);
        if (prev) {
          a.set(prev.shift, {
            ...prev,
            endtime: c.endtime,
            availabletime: c.type === 'shift'
              ? prev.availabletime + c.duration
              : prev.availabletime,
            breaktime: c.type === 'break'
              ? prev.breaktime + c.duration
              : prev.breaktime,
          });
        } else {
          a.set(c.shift, {
            index,
            type: c.type,
            starttime: c.starttime,
            endtime: c.endtime,
            duration: c.duration,
            shift: c.shift,
            availabletime: c.type === 'shift'
              ? c.duration
              : 0,
            breaktime: c.type === 'break'
              ? c.duration
              : 0,
          });
          index += 1;
        }
        return a;
      }, new Map()).values();
      shifts = [...shifts].map((s) => ({
        sortindex: s.index,
        displayshift: s.shift,
        availabletimeinms: s.availabletime,
        breaktimeinms: s.breaktime,
        totaltimeinms: s.availabletime + s.breaktime,
      }));
      const payload = {
        elementName: 'shiftwiseavailabletime',
        records: shifts,
      };
      await this.upsertBulkRecords(payload);
    },
    async saveAvaliableTime(records) {
      const hourRecords = this.saveHourlyAvailableTime(records);
      const shiftRecords = this.saveShiftWiseAvailableTime(records);
      await Promise.all([hourRecords, shiftRecords]);
    },
    async save() {
      this.saving = true;
      const records = this.hours.map((hour, index) => ({
        ...hour,
        sortindex: index + 1,
        shift: hour.type === 'shift' ? hour.name : hour.shift,
        duration: getDurationBetweenTime(hour.endtime, hour.starttime),
      }));
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
        const payload = {
          elementName: 'businesshours',
          records,
        };
        await this.upsertBulkRecords(payload);
        await this.saveAvaliableTime(records);
      }
      this.saving = false;
    },
  },
};
</script>
