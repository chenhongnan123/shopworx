<template>
  <v-responsive max-height="274" min-height="274" min-width="411">
    <v-card
      flat
      outlined
      class="flex"
      height="100%"
      rounded="lg"
      v-if="machine"
      dark
      :color="`${color} darken-2`"
    >
      <v-card-title class="headline font-weight-medium justify-space-between pb-0">
        <div>
          {{ machine.machinename }}
        </div>
      </v-card-title>
      <v-window
        v-model="card"
        v-if="machine.production.length"
        class="px-4"
      >
        <v-window-item v-for="(prod, n) in machine.production" :key="n">
          <div
            :class="`d-inline-block text-truncate
              pt-2 title font-weight-regular ${color}--text text--lighten-4`"
            style="max-width: 65%"
          >
            {{ prod.partname }}
          </div>
          <span class="float-right">
            <span :class="`display-1 ${color}--text text--lighten-4 font-weight-medium`">
              {{ prod.produced }}</span>
              <span :class="`title ${color}--text text--lighten-4`">/{{ prod.timeTarget }}</span>
          </span>
          <v-progress-linear
            :color="`${color} lighten-2`"
            :value="(prod.produced/prod.timeTarget)* 100"
          ></v-progress-linear>
        </v-window-item>
      </v-window>
      <div class="d-inline-block" style="width:60%">
        <div v-if="machine.machinestatus === 'UP'" class="px-4 mt-2">
          <v-row no-gutters>
            <v-col cols="6" class="py-0">
              <div :class="`${color}--text text--lighten-4`">
                Availability
              </div>
              <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
                {{ availabilityText }}
              </div>
            </v-col>
            <v-col cols="6" class="py-0">
              <div :class="`${color}--text text--lighten-4`">
                Performance
              </div>
              <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
                {{ performanceText }}
              </div>
            </v-col>
          </v-row>
          <div :class="`${color}--text text--lighten-4 mt-1`">
            Quality
          </div>
          <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
            {{ qualityText }}
          </div>
        </div>
        <div v-if="machine.machinestatus === 'DOWN'" class="px-4 mt-2">
          <div :class="`${color}--text text--lighten-4 mt-2`">
            Down since
          </div>
          <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
            {{ getStrictDistance(machine.downsince) }}
          </div>
          <div :class="`${color}--text text--lighten-4 mt-2`">
            Down reason
          </div>
          <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
            {{ machine.downreason || '-' }}
          </div>
        </div>
        <div v-if="machine.machinestatus === 'NOPLAN'" class="px-4 mt-2">
          <div :class="`${color}--text text--lighten-4 display-1`">
            No plan
          </div>
          <div :class="`${color}--text text--lighten-4 display-1`">
            available
          </div>
        </div>
      </div>
      <div class="float-right">
        <v-progress-circular
          size="155"
          :value="oee"
          rotate="-90"
          width="12"
          class="mt-2 mr-4"
          :color="`${color} lighten-4`"
        >
          <span class="display-1 font-weight-medium">{{ oeeText }}</span>
        </v-progress-circular>
      </div>
      <v-card-actions style="position: absolute; bottom: 0;">
        Last update {{ lastUpdate }}
      </v-card-actions>
    </v-card>
  </v-responsive>
</template>

<script>
import { timeDistance, distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'DetailView',
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
      return ((this.availability * this.performance * this.quailty) / 100) || 0;
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
      return `${(this.oee).toFixed(2)}%`;
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
