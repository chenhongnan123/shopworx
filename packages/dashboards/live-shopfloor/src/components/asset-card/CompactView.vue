<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      :color="`${color} darken-2`"
      class="white--text pa-0"
      hide-actions
    >
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="white--text d-flex justify-space-between">
            {{ machine.machinename }}
            <span>
              {{ oeeText }}
            </span>
          </v-list-item-title>
          <v-list-item-subtitle class="white--text">
            <v-window v-model="card" v-if="machine.production.length">
              <v-window-item v-for="(prod, n) in machine.production" :key="n">
                <div class="d-flex justify-space-between align-center">
                  <div
                    :class="`d-inline-block text-truncate
                    font-weight-regular ${color}--text text--lighten-4`"
                    style="max-width: 56vw"
                  >
                    {{ prod.partname }}
                  </div>
                  <div>
                    <span
                      :class="`${color}--text text--lighten-4 font-weight-medium`"
                    >
                      {{ prod.produced }}</span
                    >
                    <span :class="`${color}--text text--lighten-4`"
                      >/{{ prod.timeTarget }}
                    </span>
                  </div>
                </div>
              </v-window-item>
            </v-window>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-header>
    <v-expansion-panel-content :color="`${color} darken-2`">
      <div v-if="machine.machinestatus === 'UP'" class="mx-n2">
        <div
          :class="`${color}--text text--lighten-4 d-flex justify-space-between pt-2`"
          style="border-top: 1px solid #beffba"
        >
          <span>Availability</span>
          {{ availabilityText }}
        </div>
        <div
          class="d-flex justify-space-between mt-1"
          :class="`${color}--text text--lighten-4`"
        >
          <span>Performance</span>
          {{ performanceText }}
        </div>
        <div
          class="d-flex justify-space-between mt-1"
          :class="`${color}--text text--lighten-4`"
        >
          <span>Quality</span>
          {{ qualityText }}
        </div>
      </div>
      <div v-if="machine.machinestatus === 'DOWN'" class="mx-n2">
        <div
          :class="`${color}--text text--lighten-4 d-flex justify-space-between pt-2`"
          style="border-top: 1px solid #ffc6b9"
        >
          <span>Down since</span>
          {{ getStrictDistance(machine.downsince) }}
        </div>
        <div
          class="d-flex justify-space-between mt-1"
          :class="`${color}--text text--lighten-4`"
        >
          <span>Down reason</span>
          {{ machine.downreason || '-' }}
        </div>
      </div>
      <div v-if="machine.machinestatus === 'NOPLAN'" class="mx-n2">
        <div
          :class="`${color}--text text--lighten-4 pt-3`"
          style="font-size: 1.2rem; border-top: 1px solid #cae9f9"
        >
          No plan available
        </div>
      </div>
      <div class="white--text mx-n2 mt-2">
        Last update {{ lastUpdate }}
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { timeDistance, distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'CompactView',
  props: {
    machine: {
      type: Object,
    },
  },
  inject: ['theme'],
  data() {
    return {
      card: 0,
      interval: null,
      cardInterval: null,
      lastUpdate: '',
    };
  },
  computed: {
    color() {
      let color = '';
      if (this.machine) {
        const { machinestatus } = this.machine;
        if (machinestatus === 'UP') {
          color = 'success';
        } else if (machinestatus === 'DOWN') {
          color = 'error';
        } else if (machinestatus === 'NOPLAN') {
          color = 'info';
        }
      }
      return color;
    },
    backgroundShade() {
      const { isDark } = this.theme;
      if (isDark) {
        return 'darken';
      }
      return 'lighten';
    },
    textShade() {
      const { isDark } = this.theme;
      if (isDark) {
        return 'lighten';
      }
      return 'darken';
    },
    updatedAt() {
      return this.machine.updatedAt;
    },
    production() {
      return this.machine.production;
    },
    availability() {
      return this.machine.runtime / this.machine.workingTime;
    },
    performance() {
      return this.machine.performance;
    },
    quailty() {
      return this.machine.quality;
    },
    oee() {
      return (this.availability * this.performance * this.quailty) / 100 || 0;
    },
    qualityText() {
      return `${this.quailty.toFixed(2)}%`;
    },
    availabilityText() {
      return `${(this.availability * 100).toFixed(2)}%`;
    },
    performanceText() {
      return `${this.performance.toFixed(2)}%`;
    },
    oeeText() {
      return `${this.oee.toFixed(2)}%`;
    },
  },
  methods: {
    getStrictDistance(datetime) {
      return timeDistance(datetime, new Date().getTime());
    },
    getDistance(datetime) {
      return distanceInWordsToNow(datetime, { addSuffix: true });
    },
    next() {
      if (this.card + 1 === this.production.length) {
        this.card = 0;
      } else {
        this.card += 1;
      }
    },
  },
  created() {
    const self = this;
    this.interval = setInterval(() => {
      self.lastUpdate = self.getDistance(self.updatedAt);
    }, 60000);
    this.cardInterval = setInterval(() => {
      self.next();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.cardInterval);
  },
  watch: {
    updatedAt: {
      immediate: true,
      handler(val) {
        this.lastUpdate = this.getDistance(val);
      },
    },
  },
};
</script>
