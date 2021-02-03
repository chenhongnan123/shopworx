<template>
  <div style="height: 100%">
    <production-planning-loading v-if="loading" />
    <production-planning-setup v-else-if="!loading && !onboarded" />
    <template v-else>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex';
import ProductionPlanningLoading from './ProductionPlanningLoading.vue';
import ProductionPlanningSetup from './ProductionPlanningSetup.vue';

export default {
  name: 'ProductionPlanningIndex',
  components: {
    ProductionPlanningLoading,
    ProductionPlanningSetup,
  },
  data() {
    return {
      loading: false,
      sseClient: null,
      timeout: null,
      readyState: 0,
      states: [
        { text: 'Connecting', color: 'warning' },
        { text: 'Open', color: 'success' },
        { text: 'Closed', color: 'error' },
      ],
    };
  },
  computed: {
    ...mapState('productionPlanning', [
      'onboarded',
      'planningList',
      'reorderPlanList',
      'selectedPlan',
    ]),
    ...mapState('webApp', ['config', 'storageLocation']),
  },
  async created() {
    this.loading = true;
    const config = localStorage.getItem(this.storageLocation.planning);
    if (config) {
      this.setConfig(JSON.parse(config));
    } else {
      this.resetConfig();
    }
    const appId = localStorage.getItem('appId');
    await this.getAppSchema(appId);
    await this.getOnboardingState();
    if (this.onboarded) {
      await Promise.all([
        this.fetchShifts(),
        this.fetchParts(),
        this.fetchAssets(),
      ]);
      this.sseInit();
    }
    this.loading = false;
  },
  beforeDestroy() {
    this.sseClient.close();
    clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations('webApp', ['setConfig', 'resetConfig']),
    ...mapMutations('productionPlanning', [
      'setPlan',
      'removeNotStartedPlan',
      'setPlanView',
    ]),
    ...mapActions('webApp', ['getAppSchema']),
    ...mapActions('productionPlanning', [
      'getOnboardingState',
      'fetchShifts',
      'fetchParts',
      'fetchAssets',
      'getScheduledEnd',
    ]),
    sseInit() {
      this.sseClient = new EventSource('/sse/asm');
      this.readyState = this.sseClient.readyState;
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener('plan', (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        if (eventData.elementName === 'cycletime') {
          this.setEventData(eventData);
        }
      });
      this.sseClient.onerror = (event) => {
        this.readyState = event.target.readyState;
        this.sseClient.close();
        this.reconnectSse();
      };
    },
    reconnectSse() {
      let sseOK = false;
      if (this.sseClient === null) {
        sseOK = false;
      } else {
        sseOK = (this.sseClient.readyState !== EventSource.CLOSED);
      }
      this.readyState = this.sseClient.readyState;
      if (!sseOK) {
        this.sseInit();
      }
    },
    async setEventData(data) {
      const routeName = this.$route.name;
      const isDefaultView = routeName === 'productionPlanning';
      const isReorderView = routeName === 'reorderPlans';
      const isPlanView = routeName === 'productionPlanDetails';
      const averagecycletime = (data.actm_sum / 1000) / data.actm_count;
      const payload = {
        runtime: data.actm_sum,
        status: 'inProgress',
        actualquantity: data.qty,
        activecavity: data.activecavity,
        averagecycletime: averagecycletime.toFixed(2),
      };
      if (isDefaultView) {
        for (let i = 0; i < this.planningList.length; i += 1) {
          if (this.planningList[i].planid === data.planid
            && this.planningList[i].partname === data.partname
            && this.planningList[i].status !== 'abort') {
            this.setPlan({
              index: i,
              payload: {
                ...this.planningList[i],
                ...payload,
              },
            });
          }
        }
      } else if (isReorderView) {
        for (let i = 0; i < this.reorderPlanList.length; i += 1) {
          if (this.reorderPlanList[i].planid === data.planid
            && this.reorderPlanList[i].partname === data.partname) {
            this.removeNotStartedPlan({ index: i });
          }
        }
      } else if (isPlanView) {
        for (let i = 0; i < this.selectedPlan.length; i += 1) {
          if (this.selectedPlan[i].planid === data.planid
            && this.selectedPlan[i].partname === data.partname
            && this.selectedPlan[i].status !== 'abort') {
            this.setPlanView({
              index: i,
              payload: {
                ...this.selectedPlan[i],
                ...payload,
                // eslint-disable-next-line
                scheduledend: await this.getScheduledEnd({
                  start: new Date().getTime(),
                  duration: data.remainingDuration,
                }),
              },
            });
          }
        }
      }
    },
  },
  watch: {
    config: {
      deep: true,
      handler(val) {
        localStorage.setItem(this.storageLocation.planning, JSON.stringify(val));
      },
    },
    async onboarded(val) {
      if (val) {
        await Promise.all([
          this.fetchShifts(),
          this.fetchParts(),
          this.fetchAssets(),
        ]);
        this.sseInit();
      }
    },
  },
};
</script>
