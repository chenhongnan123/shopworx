<template>
  <v-card outlined>
    <v-card-title>
      <div>
        <v-checkbox
        class="ma-0 mb-2"
        hide-details
        v-show="toggleSelection"
        v-model="selectedDowntime"
        :value="downtime"
        ></v-checkbox>
      </div>
      <div>
        {{ new Date(downtime.downtimestart).toLocaleTimeString('en-GB') }}
        to
        <span v-if="!inProgress">
          {{ new Date(downtime.downtimeend).toLocaleTimeString('en-GB') }}
        </span>
        <span v-else>
          N.A
        </span>
      </div>
      <v-spacer></v-spacer>
      <downtime-split
        :downtime="downtime"
        :duration="duration"
        :inProgress="inProgress"
      />
    </v-card-title>
    <v-card-text>
      <v-row no-gutters >
        <v-col cols="12" sm="6">
          <div class="body-2">
            Machine
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ downtime.machinename }}
          </div>
          <div class="body-2">
            Shift
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ downtime.shiftName }}
          </div>
          <div class="body-2" v-if="!inProgress">
            Duration
          </div>
          <div class="body-2" v-else>
            Status
          </div>
          <div
            v-if="!inProgress"
            class="text-uppercase title font-weight-regular mb-2"
          >
            {{ duration }}
          </div>
          <div
            v-else
            class="text-uppercase title font-weight-regular mb-2"
          >
            Ongoing
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <template v-if="downtime.isBreak">
            <div class="body-2">
              Break
            </div>
            <div class="text-uppercase primary--text title font-weight-regular mb-2">
              {{ downtime.breakName }}
            </div>
          </template>
          <template v-if="downtime.isHoliday">
            <div class="body-2">
              Holiday
            </div>
            <div class="text-uppercase primary--text title font-weight-regular mb-2">
              {{ downtime.holidayName }}
            </div>
          </template>
          <div class="body-2">
            Reason
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            <assign-downtime :downtime="downtime" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import DowntimeSplit from './DowntimeSplit.vue';
import AssignDowntime from './AssignDowntime.vue';

export default {
  name: 'DowntimeListItem',
  props: {
    downtime: {
      type: Object,
      required: true,
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    DowntimeSplit,
    AssignDowntime,
  },
  computed: {
    ...mapState('downtimeLog', ['toggleSelection']),
    selectedDowntime: {
      get() {
        console.log(this.selected);
        return this.selected;
      },
      set(val) {
        console.log(val);
        this.$emit('update:selected', val);
      },
    },
    duration() {
      const d = this.downtime.downtimeduration;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
    },
    inProgress() {
      return this.downtime.status === 'inProgress';
    },
  },
};
</script>
