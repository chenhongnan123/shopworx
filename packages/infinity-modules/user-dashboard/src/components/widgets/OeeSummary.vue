<template>
  <v-card>
    <v-card-title primary-title>
      {{ $t('shiftOee') }}
    </v-card-title>
    <v-card-text class="text-center" v-if="thisShiftSummary && previousShiftSummary">
      <v-progress-circular
        size="180"
        :value="thisShiftOee"
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
        {{ $t('oee') }}
      </div>
      <v-tabs
        grow
        center-active
        show-arrows
        class="mt-4"
        v-model="tab"
        icons-and-text
      >
        <v-tab class="text-none">
          {{ $t('availability') }}
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
          {{ $t('performance') }}
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
          {{ $t('quality') }}
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
          <highcharts class="mt-4" :options="downtimeByMachineOptions"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="downtimeByReason">
          <highcharts class="mt-4" :options="downtimeByReasonOptions"></highcharts>
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
          <highcharts class="mt-4" :options="productionByMachineOptions"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="targetByMachine">
          <highcharts class="mt-4" :options="targetByMachineOptions"></highcharts>
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
          <highcharts class="mt-4" :options="rejectionByMachineOptions"></highcharts>
        </v-col>
        <v-col cols="12" xl="6" v-if="rejectionByReason">
          <highcharts class="mt-4" :options="rejectionByReasonOptions"></highcharts>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-else-if="loading">
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
              {{ $t('fetchingOee') }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text v-else>
      <v-container fill-height>
        <v-row
          align="center"
          justify="center"
          :no-gutters="$vuetify.breakpoint.smAndDown"
        >
          <v-col cols="5" align="center">
            <v-img
              :src="require(`@shopworx/assets/illustrations/${notFoundIllustration}.svg`)"
              contain
            />
          </v-col>
          <v-col cols="12" align="center">
            <span class="headline">
              {{ $t('noRecordsOee') }}
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
      downtimeByMachineOptions: {},
      downtimeByReasonOptions: {},
      productionByMachineOptions: {},
      targetByMachineOptions: {},
      rejectionByMachineOptions: {},
      rejectionByReasonOptions: {},
    };
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('userDashboard', [
      'loading',
      'thisShiftSummary',
      'previousShiftSummary',
      'downtimeByMachine',
      'downtimeByReason',
      'productionByMachine',
      'targetByMachine',
      'rejectionByMachine',
      'rejectionByReason',
    ]),
    notFoundIllustration() {
      return this.$vuetify.theme.dark
        ? 'not-found-dark'
        : 'not-found-light';
    },
    thisShiftA() {
      return (this.thisShiftSummary && this.thisShiftSummary.a) || 0;
    },
    thisShiftAText() {
      return `${this.roundOff(this.thisShiftA)}%`;
    },
    thisShiftP() {
      return (this.thisShiftSummary && this.thisShiftSummary.p) || 0;
    },
    thisShiftPText() {
      return `${this.roundOff(this.thisShiftP)}%`;
    },
    thisShiftQ() {
      return (this.thisShiftSummary && this.thisShiftSummary.q) || 0;
    },
    thisShiftQText() {
      return `${this.roundOff(this.thisShiftQ)}%`;
    },
    thisShiftOee() {
      return (this.thisShiftSummary && this.thisShiftSummary.oee) || 0;
    },
    thisShiftOeeText() {
      return `${this.roundOff(this.thisShiftOee)}%`;
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
      return this.thisShiftA - this.previousShiftA;
    },
    aDiffText() {
      return `${this.roundOff(Math.abs(this.aDiff))}%`;
    },
    pDiff() {
      return this.thisShiftP - this.previousShiftP;
    },
    pDiffText() {
      return `${this.roundOff(Math.abs(this.pDiff))}%`;
    },
    qDiff() {
      return this.thisShiftQ - this.previousShiftQ;
    },
    qDiffText() {
      return `${this.roundOff(Math.abs(this.qDiff))}%`;
    },
    oeeDiff() {
      return this.thisShiftOee - this.previousShiftOee;
    },
    oeeDiffText() {
      return `${this.roundOff(Math.abs(this.oeeDiff))}%`;
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
    setOptions(options) {
      const opt = { ...options };
      opt.title.style = {};
      opt.title.text = this.$t(`${options.title.text}`);
      opt.title.style.color = this.isDark ? '#FFFFFF' : '#333333';
      opt.yAxis = options.yAxis.map((axis) => {
        const labels = {
          style: { color: this.isDark ? '#FFFFFF' : '#666666' },
        };
        if (axis.labels) {
          return { ...axis, labels: { ...axis.labels, ...labels } };
        }
        return {
          ...axis,
          labels,
        };
      });
      opt.xAxis.labels = {};
      opt.xAxis.labels.style = {};
      opt.xAxis.labels.style.color = this.isDark ? '#FFFFFF' : '#666666';
      return opt;
    },
  },
  watch: {
    downtimeByMachine(val) {
      this.downtimeByMachineOptions = this.setOptions(val);
    },
    downtimeByReason(val) {
      this.downtimeByReasonOptions = this.setOptions(val);
    },
    productionByMachine(val) {
      this.productionByMachineOptions = this.setOptions(val);
    },
    targetByMachine(val) {
      this.targetByMachineOptions = this.setOptions(val);
    },
    rejectionByMachine(val) {
      this.rejectionByMachineOptions = this.setOptions(val);
    },
    rejectionByReason(val) {
      this.rejectionByReasonOptions = this.setOptions(val);
    },
    isDark() {
      this.downtimeByMachineOptions = this.setOptions(this.downtimeByMachine);
      this.downtimeByReasonOptions = this.setOptions(this.downtimeByReason);
      this.productionByMachineOptions = this.setOptions(this.productionByMachine);
      this.targetByMachineOptions = this.setOptions(this.targetByMachine);
      this.rejectionByMachineOptions = this.setOptions(this.rejectionByMachine);
      this.rejectionByReasonOptions = this.setOptions(this.rejectionByReason);
    },
  },
};
</script>

<style>
.v-progress-circular .v-progress-circular__info {
  display: block;
}
</style>
