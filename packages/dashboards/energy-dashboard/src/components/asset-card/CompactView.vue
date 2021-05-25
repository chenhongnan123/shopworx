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
            {{ meter.metername }}
            <span>
              {{ meter.consumption }} kWh
            </span>
          </v-list-item-title>
          <v-list-item-subtitle class="white--text">
            <div class="d-flex justify-space-between align-center">
              <div
                :class="`d-inline-block text-truncate
                font-weight-regular ${color}--text text--lighten-4`"
                style="max-width: 56vw"
              >
                Meter reading
              </div>
              <div>
                <span
                  :class="`${color}--text text--lighten-4 font-weight-medium`"
                >
                  {{ meter.kwh }}
                </span> kWh
              </div>
            </div>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-expansion-panel-header>
    <v-expansion-panel-content :color="`${color} darken-2`">
      <div class="mx-n2">
        <div
          :class="`${color}--text text--lighten-4 d-flex justify-space-between pt-2`"
          style="border-top: 1px solid #beffba"
        >
          <span>Current</span>
          {{ meter.current }} A
        </div>
        <div
          class="d-flex justify-space-between mt-1"
          :class="`${color}--text text--lighten-4`"
        >
          <span>VLN</span>
          {{ meter.vln }} V
        </div>
        <div
          class="d-flex justify-space-between mt-1"
          :class="`${color}--text text--lighten-4`"
        >
          <span>PF</span>
          {{ meter.pf }}
        </div>
      </div>
      <div class="white--text mx-n2 mt-2">
        Last update {{ lastUpdate }}
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'CompactView',
  props: {
    meter: {
      type: Object,
    },
  },
  inject: ['theme'],
  data() {
    return {
      card: 0,
      interval: null,
      lastUpdate: '',
    };
  },
  computed: {
    ...mapState('energyDashboard', ['currentTime']),
    color() {
      let color = '';
      if (this.meter) {
        const { meterstatus } = this.meter;
        if (meterstatus === 0) {
          color = 'success';
        } else if (meterstatus === 1) {
          color = 'error';
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
      return this.meter.updatedAt;
    },
  },
  methods: {
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
