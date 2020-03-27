<template>
  <div>
    <span class="headline">
      Update business's daily hours
    </span>
    <div v-if="fetching">
      Fetching hours...
    </div>
    <validation-observer #default="{ invalid, validated, passes }" v-else>
      <v-form @submit.prevent="passes(save)">
        <v-card
          flat
          :key="index"
          class="mb-2"
          v-for="(hour, index) in hours"
        >
          <v-row>
            <v-col cols="4">
              <validation-provider
                name="Type"
                rules="required"
                #default="{ errors }"
              >
                <v-select
                  label="Type"
                  :items="items"
                  item-text="text"
                  item-value="value"
                  v-model="hour.type"
                  hide-details="auto"
                  :error-messages="errors"
                  :prepend-inner-icon="hour.type === 'shift'
                    ? 'mdi-clock-outline'
                    : 'mdi-timer-sand'"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="8" v-if="hour.type === 'shift'">
              <validation-provider
                name="Name"
                rules="required_if:hour.type,shift"
                #default="{ errors }"
              >
                <v-text-field
                  type="text"
                  label="Name"
                  v-model="hour.name"
                  hide-details="auto"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="hour.type === 'break'">
              <validation-provider
                name="Name"
                rules="required_if:hour.type,break"
                #default="{ errors }"
              >
                <v-text-field
                  type="text"
                  label="Name"
                  v-model="hour.name"
                  hide-details="auto"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="hour.type === 'break'">
              <validation-provider
                name="Shift"
                rules="required_if:hour.type,break"
                #default="{ errors }"
              >
                <v-select
                  :items="shifts"
                  label="Include in"
                  hide-details="auto"
                  v-model="hour.shift"
                  :error-messages="errors"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                rules="required"
                name="Start time"
                #default="{ errors }"
              >
                <v-text-field
                  type="time"
                  label="Start time"
                  hide-details="auto"
                  v-model="hour.starttime"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider
                name="End time"
                rules="required"
                #default="{ errors }"
              >
                <v-text-field
                  type="time"
                  label="End time"
                  hide-details="auto"
                  v-model="hour.endtime"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="my-auto">
              <v-btn
                icon
                small
                class="mx-2"
                @click="addHour"
              >
                <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                class="pa-0"
                @click="removeHour(index)"
                :disabled="hours.length === 1"
              >
                <v-icon>mdi-minus-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider v-if="index + 1 != hours.length"></v-divider>
        </v-card>
        <v-btn
          block
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
          :disabled="invalid || !validated"
        >
          <v-icon left>mdi-skip-next-circle-outline</v-icon>
          Next
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
        text: 'Shift',
        value: 'shift',
      },
      {
        text: 'Break',
        value: 'break',
      }],
      hours: [{
        type: '',
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
            starttime: rec.starttime,
            endtime: rec.endtime,
          }))
          .sort((a, b) => a.sortindex - b.sortIndex);
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
