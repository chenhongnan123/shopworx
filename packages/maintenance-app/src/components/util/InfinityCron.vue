<template>
  <!--prettier-ignore-->
  <v-container class="pa-0">
    <v-form>
      <v-tabs class="elevation-0" color="primary" slider-color="primary" v-model="tab">
        <v-tab>
          Minute
        </v-tab>
        <v-tab>
          Hour
        </v-tab>
        <v-tab>
          Day of Month
        </v-tab>
        <v-tab>
          Month
        </v-tab>
        <v-tab>
          Week
        </v-tab>
      </v-tabs>
      <v-tabs-items class="elevation-3 px-3 py-1" v-model="tab" style="height: 320px;">
        <v-tab-item>
          <v-radio-group class="mt-0" v-model="cronType.minute" :mandatory="false">
            <v-radio label="Any Minute" value="0"></v-radio>
            <v-radio label="Range with Step Minute" value="1"></v-radio>
            <v-radio label="Assign Minute" value="2"></v-radio>
          </v-radio-group>
          <v-form ref="minute" v-if="cronType.minute === '1'">
            <v-text-field
              label="From"
              type="number"
              v-model="cronConfig.minute.from"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="To"
              type="number"
              v-model="cronConfig.minute.to"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="Step Value"
              type="number"
              v-model="cronConfig.minute.step"
              :rules="rules.notblank"
            ></v-text-field>
          </v-form>
          <v-form ref="minute" v-else-if="cronType.minute === '2'" class="grid">
            <!-- <v-autocomplete
              :items="minutes"
              outlined
              dense
              label="Assign Minutes"
              multiple
              v-model="cronConfig.minute.assigned"
              :rules="rules.notblank"
            ></v-autocomplete> -->
            <v-checkbox
              v-for="m in minutes"
              :key="m"
              v-model="cronConfig.minute.assigned[m]"
              :label="String(m)"
              :value="true"
              class="mt-0"
              dense
            ></v-checkbox>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-radio-group class="mt-0" v-model="cronType.hour" :mandatory="false">
            <v-radio label="Any Hour" value="0"></v-radio>
            <v-radio label="Range with Step  Hour" value="1"></v-radio>
            <v-radio label="Assign Hour" value="2"></v-radio>
          </v-radio-group>
          <v-form ref="hour" v-if="cronType.hour === '1'">
            <v-text-field
              label="From"
              type="number"
              v-model="cronConfig.hour.from"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="To"
              type="number"
              v-model="cronConfig.hour.to"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="Step Value"
              type="number"
              v-model="cronConfig.hour.step"
              :rules="rules.notblank"
            ></v-text-field>
          </v-form>
          <v-form ref="hour" v-else-if="cronType.hour === '2'" class="grid">
            <!-- <v-autocomplete
              :items="hours"
              outlined
              dense
              label="Assign Hours"
              multiple
              v-model="cronConfig.hour.assigned"
              :rules="rules.notblank"
            ></v-autocomplete> -->
            <v-checkbox
              v-for="h in hours"
              :key="h"
              v-model="cronConfig.hour.assigned[m]"
              :label="String(h)"
              :value="true"
              class="mt-0"
              dense
            ></v-checkbox>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-radio-group class="mt-0" v-model="cronType.day" :mandatory="false">
            <v-radio label="Any Day" value="0"></v-radio>
            <v-radio label="Range with Step Day" value="1"></v-radio>
            <v-radio label="Assign Day" value="2"></v-radio>
          </v-radio-group>
          <v-form ref="day" v-if="cronType.day === '1'">
            <v-text-field
              label="From"
              type="number"
              v-model="cronConfig.day.from"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="To"
              type="number"
              v-model="cronConfig.day.to"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="Step Value"
              type="number"
              v-model="cronConfig.day.step"
              :rules="rules.notblank"
            ></v-text-field>
          </v-form>
          <v-form ref="day" v-else-if="cronType.day === '2'" class="grid">
            <!-- <v-autocomplete
              :items="days"
              outlined
              dense
              label="Assign Days"
              multiple
              v-model="cronConfig.day.assigned"
              :rules="rules.notblank"
            ></v-autocomplete> -->
            <v-checkbox
              v-for="d in days"
              :key="d"
              v-model="cronConfig.day.assigned[d]"
              :label="String(d)"
              :value="true"
              class="mt-0"
              dense
            ></v-checkbox>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-radio-group class="mt-0" v-model="cronType.month" :mandatory="false">
            <v-radio label="Any Month" value="0"></v-radio>
            <v-radio label="Range with Step  Month" value="1"></v-radio>
            <v-radio label="Assign Month" value="2"></v-radio>
          </v-radio-group>
          <v-form ref="month" v-if="cronType.month === '1'">
            <v-text-field
              label="From"
              type="number"
              v-model="cronConfig.month.from"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="To"
              type="number"
              v-model="cronConfig.month.to"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="Step Value"
              type="number"
              v-model="cronConfig.month.step"
              :rules="rules.notblank"
            ></v-text-field>
          </v-form>
          <v-form ref="month" v-else-if="cronType.month === '2'" class="grid">
            <!-- <v-autocomplete
              :items="months"
              outlined
              dense
              label="Assign Months"
              multiple
              v-model="cronConfig.month.assigned"
              :rules="rules.notblank"
            ></v-autocomplete> -->
            <v-checkbox
              v-for="m in months"
              :key="m"
              v-model="cronConfig.month.assigned[m]"
              :label="String(m)"
              :value="true"
              class="mt-0"
              dense
            ></v-checkbox>
          </v-form>
        </v-tab-item>
        <v-tab-item>
          <v-radio-group class="mt-0" v-model="cronType.week" :mandatory="false">
            <v-radio label="Any Days of Week" value="0"></v-radio>
            <v-radio label="Range Days of Week" value="1"></v-radio>
            <v-radio label="Assign Days of Week" value="2"></v-radio>
          </v-radio-group>
          <v-form ref="week" v-if="cronType.week === '1'">
            <v-text-field
              label="From"
              type="number"
              v-model="cronConfig.week.from"
              :rules="rules.notblank"
            ></v-text-field>
            <v-text-field
              label="To"
              type="number"
              v-model="cronConfig.week.to"
              :rules="rules.notblank"
            ></v-text-field>
          </v-form>
          <v-form ref="week" v-else-if="cronType.week === '2'" class="grid">
            <!-- <v-autocomplete
              :items="weeks"
              outlined
              dense
              label="Assign Minutes"
              multiple
              v-model="cronConfig.week.assigned"
              :rules="rules.notblank"
            ></v-autocomplete> -->
            <v-checkbox
              v-for="w in weeks"
              :key="w"
              v-model="cronConfig.week.assigned[w]"
              :label="String(w)"
              :value="true"
              class="mt-0"
              dense
            ></v-checkbox>
          </v-form>
        </v-tab-item>
      </v-tabs-items>
      <v-toolbar dense>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="generateCron"
          :disabled="($refs.minute && !$refs.minute.validate())
          || ($refs.hour && !$refs.hour.validate())
          || ($refs.day && !$refs.day.validate())
          || ($refs.month && !$refs.month.validate())
          || ($refs.week && !$refs.week.validate())"
        >Generate</v-btn>
      </v-toolbar>
      <v-text-field class="mt-3" outlined label="Cron Express"
      v-model="express" @input="changeCron" @keydown="stopEnter"></v-text-field>
      <v-textarea height="120" readonly outlined label="Sample Result" v-model="rst"></v-textarea>
    </v-form>
  </v-container>
</template>
<script>
import { formatDate } from '@shopworx/services/util/date.service';
import later from '@breejs/later';
import cronvalidate from 'cron-validate';

export default {
  name: 'InfinityCron',
  data() {
    return {
      tab: null,
      cronType: {
        minute: '0',
        hour: '0',
        day: '0',
        month: '0',
        week: '0',
      },
      cronConfig: {
        minute: {
          from: null,
          to: null,
          step: 1,
          assigned: [],
        },
        hour: {
          from: null,
          to: null,
          step: 1,
          assigned: [],
        },
        day: {
          from: null,
          to: null,
          step: 1,
          assigned: [],
        },
        month: {
          from: null,
          to: null,
          step: 1,
          assigned: [],
        },
        week: {
          from: null,
          to: null,
          assigned: [],
        },
      },
      // prettier-ignore
      minutes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      ],
      // prettier-ignore
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23],
      // prettier-ignore
      days: [1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      weeks: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      rules: {
        notblank: [(v) => !!v || 'Please input the value!'],
        integer: [(v) => Number.isInteger(Number(v)) || 'The value must be an integer number'],
      },
      express: null,
      rst: null,
    };
  },
  mounted() {
    later.date.localTime();
  },
  model: {
    prop: 'cron',
    event: 'change',
  },
  methods: {
    generateCron() {
      if (
        // prettier-ignore
        !((this.$refs.minute && !this.$refs.minute.validate())
        || (this.$refs.hour && !this.$refs.hour.validate())
        || (this.$refs.day && !this.$refs.day.validate())
        || (this.$refs.month && !this.$refs.month.validate())
        || (this.$refs.week && !this.$refs.week.validate()))
      ) {
        const { cronConfig, cronType } = this;
        Object.keys(cronConfig).forEach((k) => {
          const conf = cronConfig[k];
          if (cronType[k] === '0') {
            cronConfig[k].value = '*';
          } else if (cronType[k] === '1') {
            cronConfig[k].value = `${conf.from}-${conf.to}/${conf.step || 1}`;
          } else {
            const assigned = [];
            Object.keys(conf.assigned).forEach((key) => {
              if (conf.assigned[key]) {
                assigned.push(key);
              }
            });
            cronConfig[k].value = assigned.join(',');
          }
        });
        this.express = `${cronConfig.minute.value} ${cronConfig.hour.value} ${cronConfig.day.value} ${cronConfig.month.value} ${cronConfig.week.value}`;
        const cronresult = cronvalidate(this.express, {
          override: {
            useAliases: true,
          },
        });
        if (cronresult.isValid()) {
          const s = later.parse.cron(this.express, false);
          this.rst = later
            .schedule(s)
            .next(10)
            .map((item) => formatDate(new Date(item), 'yyyy-MM-dd HH:mm:ss'))
            .join('\n');
          this.$emit('change', {
            express: this.express,
            result: cronresult.isValid(),
          });
        } else {
          const errorValue = 'Invalid Cron Express';
          this.rst = errorValue;
          this.$emit('change', {
            express: '',
            result: cronresult.isValid(),
          });
        }
      }
    },
    changeCron() {
      const cronresult = cronvalidate(this.express, {
        override: {
          useAliases: true,
        },
      });
      if (cronresult.isValid()) {
        const s = later.parse.cron(this.express, false);
        this.rst = later
          .schedule(s)
          .next(10)
          .map((item) => formatDate(new Date(item), 'yyyy-MM-dd HH:mm:ss'))
          .join('\n');
        this.$emit('change', {
          express: this.express,
          result: cronresult.isValid(),
        });
      } else {
        const errorValue = 'Invalid Cron Express';
        this.rst = errorValue;
        this.$emit('change', {
          express: '',
          result: cronresult.isValid(),
        });
      }
    },
    stopEnter($event) {
      if ($event.code === 'Enter') {
        $event.preventDefault();
      }
    },
  },
};
</script>
<style>
.grid {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(16, 1fr);
}
</style>
