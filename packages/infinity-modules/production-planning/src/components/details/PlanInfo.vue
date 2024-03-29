<template>
  <v-card
    flat
    :class="isDark ? 'secondary' : 'primary'"
    dark
    rounded="lg"
  >
    <v-card-title primary-title>
      {{ machine }}
      <v-spacer></v-spacer>
      <v-chip
        label
        :color="getPlanStatus(status).color"
      >
        {{ $t(`planning.${getPlanStatus(status).text}`) }}
      </v-chip>
    </v-card-title>
    <v-card-text>
      <div>
        {{ $t('planning.equipment') }}
      </div>
      <div class="title white--text">
        {{ equipment }}
      </div>
      <template v-if="status === 'notStarted'">
        <div class="mt-4">
        {{ $t('planning.scheduledStart') }}
        </div>
        <div class="title white--text">
          {{ scheduledstart }}
        </div>
        <div class="mt-4">
        {{ $t('planning.scheduledEnd') }}
        </div>
        <div class="title white--text">
          {{ scheduledend }}
        </div>
      </template>
      <template v-else-if="status === 'inProgress'">
        <div class="mt-4">
        {{ $t('planning.actualStart') }}
        </div>
        <div class="title white--text">
          {{ actualstart }}
        </div>
        <div class="mt-4">
        {{ $t('planning.scheduledEnd') }}
        </div>
        <div class="title white--text">
          {{ scheduledend }}
        </div>
      </template>
      <template v-else>
        <div class="mt-4">
        {{ $t('planning.actualStart') }}
        </div>
        <div class="title white--text">
          {{ actualstart }}
        </div>
        <div class="mt-4">
        {{ $t('planning.actualEnd') }}
        </div>
        <div class="title white--text">
          {{ actualend }}
        </div>
      </template>
      <v-row class="mt-4">
        <v-col cols="4" class="py-0">
          <div>
        {{ $t('planning.planCt') }}
          </div>
          <div class="title white--text">
            {{ planCt }} {{ $t('planning.secs') }}
          </div>
        </v-col>
        <v-col cols="4" class="py-0">
          <div>
        {{ $t('planning.standardCt') }}
          </div>
          <div class="title white--text">
            {{ standardCt }} {{ $t('planning.secs') }}
          </div>
        </v-col>
        <v-col cols="4" class="py-0">
          <div>
        {{ $t('planning.averageCt') }}
          </div>
          <div class="title white--text">
            {{ averageCt }} {{ $t('planning.secs') }}
          </div>
        </v-col>
        <v-col cols="4">
          <div>
        {{ $t('planning.runtime') }}
          </div>
          <div class="title white--text">
            {{ runtime }}
          </div>
        </v-col>
        <v-col cols="4" v-if="isPress">
          <div>
        {{ $t('planning.strokes') }}
          </div>
          <div class="title white--text">
            {{ strokes }}
          </div>
        </v-col>
      </v-row>
      <div v-for="(p, n) in selectedPlan" :key="n" class="mt-4">
        <div>
          {{ $t('planning.cavity') }}
          <span class="title white--text">{{ p.activecavity}}</span>/{{p.cavity }}
        </div>
        <v-progress-linear
          :height="25"
          class="mt-1"
          :color="isDark ? 'primary' : 'secondary'"
          :value="(p.actualquantity / p.plannedquantity) * 100"
        >
          <div
            class="d-inline-block text-truncate font-weight-medium mr-auto ml-2"
            style="max-width: 65%"
            :title="p.partname"
          >
            {{ p.partname }}
          </div>
          <span class="float-right font-weight-medium mr-2">
            {{ p.actualquantity || 0 }}/{{ p.plannedquantity }}
          </span>
        </v-progress-linear>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
  mapMutations,
} from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'RejectionPareto',
  inject: ['theme'],
  data() {
    return {
      loading: false,
      standardMatrix: null,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['selectedPlan']),
    ...mapGetters('productionPlanning', ['selectedAsset', 'planStatus']),
    ...mapGetters('helper', ['locale']),
    isPress() {
      let result = false;
      if (this.selectedPlan[0] && this.selectedPlan[0].assetid) {
        result = this.selectedAsset(this.selectedPlan[0].assetid) === 'press';
      }
      return result;
    },
    isDark() {
      return this.theme.isDark;
    },
    status() {
      return this.selectedPlan[0].status;
    },
    part() {
      return this.selectedPlan[0].partname;
    },
    machine() {
      return this.selectedPlan[0].machinename;
    },
    scheduledstart() {
      return this.getFormattedDate(this.selectedPlan[0].scheduledstart);
    },
    scheduledend() {
      return this.getFormattedDate(this.selectedPlan[0].scheduledend);
    },
    actualstart() {
      return this.getFormattedDate(this.selectedPlan[0].actualstart);
    },
    actualend() {
      return this.getFormattedDate(this.selectedPlan[0].actualend);
    },
    equipment() {
      return this.selectedPlan[0].moldname || this.selectedPlan[0].toolname;
    },
    standardCt() {
      return this.standardMatrix
        ? this.standardMatrix.stdcycletime
        : 0;
    },
    planCt() {
      return this.selectedPlan[0].stdcycletime;
    },
    strokes() {
      return this.selectedPlan[0].strokes;
    },
    averageCt() {
      return this.selectedPlan[0].averagecycletime || 0;
    },
    runtime() {
      const { runtime } = this.selectedPlan[0];
      if (runtime) {
        const d = Number(runtime / 1000);
        const h = Math.floor(d / 3600);
        const m = Math.floor((d % 3600) / 60);
        const s = Math.floor((d % 3600) % 60);
        return `${h}:${m}:${s}`;
      }
      return '00:00:00';
    },
  },
  async created() {
    this.loading = true;
    const partMatrixList = await this.fetchPartMatrix({ partname: this.part });
    this.standardMatrix = partMatrixList.find((matrix) => (
      matrix.partname === this.part
      && matrix.machinename === this.machine
      && (matrix.equipmentname === this.equipment)
    ));
    if (this.status !== 'notStarted') {
      const reportData = await this.getReportData('plansummary');
      for (let i = 0; i < this.selectedPlan.length; i += 1) {
        for (let j = 0; j < reportData.length; j += 1) {
          if (this.selectedPlan[i].partname === reportData[j].partname) {
            const payload = {
              ...this.selectedPlan[i],
              ...reportData[j],
            };
            this.setPlanView({ index: i, payload });
          }
        }
      }
    }
    this.loading = false;
  },
  methods: {
    ...mapMutations('productionPlanning', ['setPlanView']),
    ...mapActions('productionPlanning', ['getReportData', 'fetchPartMatrix']),
    getPlanStatus(status) {
      return this.planStatus(status);
    },
    getFormattedDate(datetime) {
      return formatDate(
        new Date(datetime),
        'MMM d, HH:mm',
        { locale: this.locale },
      );
    },
  },
};
</script>
