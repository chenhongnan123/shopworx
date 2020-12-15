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
      <div v-if="machine.production.length" class="px-4">
        <div v-for="(prod, n) in machine.production" :key="n">
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
              <span :class="`title ${color}--text text--lighten-4`">/{{ prod.target }}</span>
          </span>
          <v-progress-linear
            :color="`${color} lighten-2`"
            :value="(prod.produced/prod.target)* 100"
          ></v-progress-linear>
        </div>
      </div>
      <div class="d-inline-block">
        <div v-if="machine.machinestatus === 'UP'" class="px-4 mt-2">
          <div :class="`${color}--text text--lighten-4`">
            Availability
          </div>
          <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
            {{ availabilityText }}
          </div>
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
          <div class="display-1">
            {{ getStrictDistance(machine.downsince) }}
          </div>
          <div :class="`${color}--text text--lighten-4 mt-2`">
            Down reason
          </div>
          <div class="display-1">
            -
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
  name: 'AssetCard',
  props: {
    machine: {
      type: Object,
    },
  },
  inject: ['theme'],
  data() {
    return {
      interval: null,
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
          color = 'warning';
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
      return this.production.length
        ? this.production[0].runtime / this.machine.shiftWorkingTime
        : 0;
    },
    performance() {
      return this.production.length
        ? (this.production[0].produced / this.production[0].target)
        : 0;
    },
    quailty() {
      return this.production.length
        ? ((this.production[0].produced - this.production[0].rejected)
          / this.production[0].produced)
        : 1;
    },
    oee() {
      return (this.availability * this.performance * this.quailty) * 100;
    },
    qualityText() {
      return `${(this.quailty * 100).toFixed(2)}%`;
    },
    availabilityText() {
      return `${(this.availability * 100).toFixed(2)}%`;
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
  },
  created() {
    const self = this;
    this.interval = setInterval(() => {
      self.lastUpdate = self.getDistance(self.updatedAt);
    }, 60000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
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
