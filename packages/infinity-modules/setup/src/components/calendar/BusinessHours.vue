<template>
  <div>
    <span class="headline">
      {{ $t('setup.onboardCalendar.hours.title') }}
    </span>
    <div v-if="fetching">
      {{ $t('setup.onboardCalendar.hours.fetching') }}
    </div>
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
        <v-btn
          block
          rounded
          type="submit"
          color="primary"
          id="finishHours"
          class="text-none"
          :loading="loading"
        >
          <v-icon
            left
            v-text="'$skip'"
          ></v-icon>
          {{ $t('helper.next') }}
        </v-btn>
      </v-form>
    </validation-observer>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import { getDurationBetweenTime } from '@shopworx/services/util/date.service';

export default {
  name: 'BusinessHours',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    master: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fetching: false,
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
    masterDetails() {
      return this.master.find((m) => m.element.elementName.toLowerCase().trim() === 'businesshours');
    },
  },
  created() {
    this.fetchRecords();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('setup', ['getElementRecords']),
    async fetchRecords() {
      this.fetching = true;
      const records = await this.getElementRecords({
        assetId: 0,
        elementName: this.masterDetails.element.elementName,
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
      this.fetching = false;
    },
    isHourMissing() {
      return this.hours.some((hour, index) => (
        index !== this.hours.length - 1
        && hour.endtime !== this.hours[index + 1].starttime
      ));
    },
    isSumInvalid() {
      const sum = this.hours.reduce((acc, cur) => acc + (this.getDuration(cur) || 0), 0);
      return !!sum;
    },
    getDuration({ endtime, starttime }) {
      const timeStart = new Date(`01/01/2007 ${starttime}`).getHours();
      const timeEnd = new Date(`01/01/2007 ${endtime}`).getHours();
      return timeEnd - timeStart;
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
    save() {
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
          element: this.masterDetails.element,
          tags: this.masterDetails.tags,
          records,
        };
        this.$emit('save', payload);
      }
    },
  },
};
</script>
