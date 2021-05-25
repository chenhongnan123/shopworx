<template>
  <v-responsive max-height="254" min-height="254" min-width="411">
    <v-card
      flat
      outlined
      class="flex"
      height="100%"
      rounded="lg"
      v-if="meter"
      dark
      :color="`${color} darken-2`"
    >
      <v-card-title class="headline font-weight-medium justify-space-between pb-0">
        <div>
          {{ meter.metername }}
        </div>
      </v-card-title>
      <div class="d-inline-block" style="width:60%">
        <div class="px-4 mt-2">
          <v-row no-gutters>
            <v-col cols="4" class="py-0">
              <div :class="`${color}--text text--lighten-4`">
                Current
              </div>
              <div :class="`font-weight-medium ${color}--text text--lighten-4`">
                <span class="display-1">{{ meter.current }}</span> A
              </div>
            </v-col>
            <v-col cols="4" class="py-0">
              <div :class="`${color}--text text--lighten-4`">
                VLN
              </div>
              <div :class="`font-weight-medium ${color}--text text--lighten-4`">
                <span class="display-1">{{ meter.vln }}</span> V
              </div>
            </v-col>
            <v-col cols="4" class="py-0">
              <div :class="`${color}--text text--lighten-4`">
                PF
              </div>
              <div :class="`display-1 font-weight-medium ${color}--text text--lighten-4`">
                {{ meter.pf }}
              </div>
            </v-col>
          </v-row>
          <div :class="`${color}--text text--lighten-4 mt-1`">
            Meter reading
          </div>
          <div :class="`font-weight-medium ${color}--text text--lighten-4`">
            <span class="display-1">{{ meter.kwh }}</span> kWh
            <span class="display-1 ml-11">{{ meter.kvah }}</span> kVAh
          </div>
        </div>
      </div>
      <div class="float-right">
        <v-progress-circular
          size="155"
          :value="meter.consumption"
          rotate="-90"
          width="12"
          class="mt-2 mr-4"
          :color="`${color} lighten-4`"
        >
          <span class="display-1 font-weight-medium">{{ meter.consumption }} kWh</span>
        </v-progress-circular>
      </div>
      <v-card-actions style="position: absolute; bottom: 0;">
        Last update {{ lastUpdate }}
      </v-card-actions>
    </v-card>
  </v-responsive>
</template>

<script>
import { mapState } from 'vuex';
import { distanceInWordsToNow } from '@shopworx/services/util/date.service';

export default {
  name: 'DetailView',
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
