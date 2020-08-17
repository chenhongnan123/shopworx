<template>
  <v-card outlined>
    <v-card-title>
      <div>
        {{ new Date(downtime.downtimestart).toLocaleTimeString('en-US') }}
        to
        {{ new Date(downtime.downtimeend).toLocaleTimeString('en-US') }}
      </div>
      <v-spacer></v-spacer>
      <downtime-split
        :downtime="downtime"
        :duration="duration"
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
          <div class="body-2">
            Duration
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            {{ duration }}
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <template v-if="downtime.isBreak">
            <div class="body-2">
              Break
            </div>
            <div class="text-uppercase title font-weight-regular mb-2">
              {{ downtime.breakName }}
            </div>
          </template>
          <template v-if="downtime.isHoliday">
            <div class="body-2">
              Holiday
            </div>
            <div class="text-uppercase title font-weight-regular mb-2">
              {{ downtime.holidayName }}
            </div>
          </template>
          <div class="body-2">
            Reason
          </div>
          <div class="text-uppercase title font-weight-regular mb-2">
            <edit-downtime-reason :downtime="downtime" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import DowntimeSplit from './DowntimeSplit.vue';
import EditDowntimeReason from './EditDowntimeReason.vue';

export default {
  name: 'DowntimeListItem',
  props: {
    downtime: {
      type: Object,
      required: true,
    },
  },
  components: {
    DowntimeSplit,
    EditDowntimeReason,
  },
  computed: {
    duration() {
      const d = this.downtime.downtimeduration;
      const h = Math.floor(d / 3600);
      const m = Math.floor((d % 3600) / 60);
      const s = Math.floor((d % 3600) % 60);
      return `${h.toString().padStart(2, 0)}:${m.toString().padStart(2, 0)}:${s.toString().padStart(2, 0)}`;
    },
  },
};
</script>
