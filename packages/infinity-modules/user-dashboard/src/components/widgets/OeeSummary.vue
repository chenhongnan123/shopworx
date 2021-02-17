<template>
  <v-card>
    <v-card-title primary-title>
      Shift OEE
    </v-card-title>
    <v-card-text class="text-center" v-if="thisShiftSummary && previousShiftSummary">
      <v-progress-circular
        size="180"
        :value="88"
        button
        width="15"
        color="primary"
        rotate="-90"
      >
        <div class="display-1">
          {{ thisShiftOeeText }}
        </div>
        <div>
          <v-icon :color="getColor(oeeDiff)">
            {{ getIcon(oeeDiff) }}
          </v-icon>
          <span
            :class="`caption ${getColor(oeeDiff)}--text`"
            style="margin-left: -8px;"
          >
            {{ oeeDiffText }}
          </span>
        </div>
      </v-progress-circular>
      <div class="headline mt-2">
        OEE
      </div>
      <v-tabs
        grow
        center-active
        class="mt-4"
        v-model="tab"
        icons-and-text
      >
        <v-tab class="text-none">
          Availability
          <span class="headline font-weight-medium">
            {{ thisShiftAText }}
            <v-icon :color="getColor(aDiff)" class="mt-1">
              {{ getIcon(aDiff) }}
            </v-icon>
            <span
              :class="`caption ${getColor(aDiff)}--text`"
              style="margin-left: -8px;"
            >
              {{ aDiffText }}
            </span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Performance
          <span class="headline font-weight-medium">
            {{ thisShiftPText }}
            <v-icon :color="getColor(pDiff)" class="mt-1">
              {{ getIcon(pDiff) }}
            </v-icon>
            <span
              :class="`caption ${getColor(pDiff)}--text`"
              style="margin-left: -8px;"
            >
              {{ pDiffText }}
            </span>
          </span>
        </v-tab>
        <v-tab class="text-none">
          Quality
          <span class="headline font-weight-medium">
            {{ thisShiftQText }}
            <v-icon :color="getColor(qDiff)" class="mt-1">
              {{ getIcon(qDiff) }}
            </v-icon>
            <span
              :class="`caption ${getColor(qDiff)}--text`"
              style="margin-left: -8px;"
            >
              {{ qDiffText }}
            </span>
          </span>
        </v-tab>
      </v-tabs>
      <v-row v-if="tab === 0">
        <v-col cols="12">
          <availability-comparision
            :thisMachines="thisShiftSummary.machines"
            :previousMachines="previousShiftSummary.machines"
          />
        </v-col>
        <v-col cols="12" xl="6" v-if="downtimeByMachine">
          <highcharts class="mt-4" :options="downtimeByMachine"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="downtimeByReason">
          <highcharts class="mt-4" :options="downtimeByReason"></highcharts>
        </v-col>
      </v-row>
      <v-row v-else-if="tab === 1">
        <v-col cols="12">
          <performance-comparision
            :thisMachines="thisShiftSummary.machines"
            :previousMachines="previousShiftSummary.machines"
          />
        </v-col>
        <v-col cols="12" xl="6" v-if="productionByMachine">
          <highcharts class="mt-4" :options="productionByMachine"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="targetByMachine">
          <highcharts class="mt-4" :options="targetByMachine"></highcharts>
        </v-col>
      </v-row>
      <v-row v-if="tab === 2">
        <v-col cols="12">
          <quality-comparision
            :thisMachines="thisShiftSummary.machines"
            :previousMachines="previousShiftSummary.machines"
          />
        </v-col>
        <v-col cols="12" xl="6" v-if="rejectionByMachine">
          <highcharts class="mt-4" :options="rejectionByMachine"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="rejectionByReason">
          <highcharts class="mt-4" :options="rejectionByReason"></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else>
      <v-container fill-height>
        <v-row
          align="center"
          justify="center"
          :no-gutters="$vuetify.breakpoint.smAndDown"
        >
          <v-col cols="12" align="center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="72"
            ></v-progress-circular>
          </v-col>
          <v-col cols="12" align="center">
            <span class="headline">
              Fetching shift summary...
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import AvailabilityComparision from './oee/AvailabilityComparision.vue';
import PerformanceComparision from './oee/PerformanceComparision.vue';
import QualityComparision from './oee/QualityComparision.vue';

export default {
  name: 'OeeSummary',
  components: {
    AvailabilityComparision,
    PerformanceComparision,
    QualityComparision,
  },
  data() {
    return {
      tab: 0,
    };
  },
  computed: {
    ...mapState('userDashboard', [
      'thisShiftSummary',
      'previousShiftSummary',
      'downtimeByMachine',
      'downtimeByReason',
      'productionByMachine',
      'targetByMachine',
      'rejectionByMachine',
      'rejectionByReason',
    ]),
    thisShiftA() {
      return (this.thisShiftSummary && this.thisShiftSummary.a) || 0;
    },
    thisShiftAText() {
      return `${this.roundOff(this.thisShiftA).toFixed(1)}%`;
    },
    thisShiftP() {
      return (this.thisShiftSummary && this.thisShiftSummary.p) || 0;
    },
    thisShiftPText() {
      return `${this.roundOff(this.thisShiftP).toFixed(1)}%`;
    },
    thisShiftQ() {
      return (this.thisShiftSummary && this.thisShiftSummary.q) || 0;
    },
    thisShiftQText() {
      return `${this.roundOff(this.thisShiftQ).toFixed(1)}%`;
    },
    thisShiftOee() {
      return (this.thisShiftSummary && this.thisShiftSummary.oee) || 0;
    },
    thisShiftOeeText() {
      return `${this.roundOff(this.thisShiftOee).toFixed(1)}%`;
    },
    previousShiftA() {
      return (this.previousShiftSummary && this.previousShiftSummary.a) || 0;
    },
    previousShiftP() {
      return (this.previousShiftSummary && this.previousShiftSummary.p) || 0;
    },
    previousShiftQ() {
      return (this.previousShiftSummary && this.previousShiftSummary.q) || 0;
    },
    previousShiftOee() {
      return (this.previousShiftSummary && this.previousShiftSummary.oee) || 0;
    },
    aDiff() {
      return ((this.thisShiftA - this.previousShiftA) / this.previousShiftA) * 100;
    },
    aDiffText() {
      return `${this.roundOff(Math.abs(this.aDiff)).toFixed(2)}%`;
    },
    pDiff() {
      return ((this.thisShiftP - this.previousShiftP) / this.previousShiftP) * 100;
    },
    pDiffText() {
      return `${this.roundOff(Math.abs(this.pDiff)).toFixed(2)}%`;
    },
    qDiff() {
      return ((this.thisShiftQ - this.previousShiftQ) / this.previousShiftQ) * 100;
    },
    qDiffText() {
      return `${this.roundOff(Math.abs(this.qDiff)).toFixed(2)}%`;
    },
    oeeDiff() {
      return ((this.thisShiftOee - this.previousShiftOee) / this.previousShiftOee) * 100;
    },
    oeeDiffText() {
      return `${this.roundOff(Math.abs(this.oeeDiff)).toFixed(2)}%`;
    },
  },
  methods: {
    roundOff(val) {
      if (val) {
        return Math.round((val + Number.EPSILON) * 100) / 100;
      }
      return 0;
    },
    getColor(number) {
      let color = 'warning';
      if (number > 0) {
        color = 'success';
      } else if (number < 0) {
        color = 'error';
      }
      return color;
    },
    getIcon(number) {
      let icon = 'mdi-minus';
      if (number > 0) {
        icon = 'mdi-menu-up';
      } else if (number < 0) {
        icon = 'mdi-menu-down';
      }
      return icon;
    },
  },
};
</script>

<style>
.v-progress-circular .v-progress-circular__info {
  display: block;
}
</style>
