<template>
  <div style="height: 100%">
    <shopfloor-loading v-if="loading" />
    <template v-else>
      <config-drawer />
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import ConfigDrawer from '../components/ConfigDrawer.vue';
import ShopfloorLoading from '../components/ShopfloorLoading.vue';

export default {
  name: 'Index',
  components: {
    ConfigDrawer,
    ShopfloorLoading,
  },
  data() {
    return {
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
  async created() {
    this.setLoading(true);
    await this.getBusinessTime();
    if (this.isLoaded) {
      await this.getMachines();
    }
    this.setLoading(false);
  },
  beforeMount() {
    this.sseInit();
  },
  beforeDestroy() {
    this.sseClient.close();
    clearTimeout(this.timeout);
  },
  watch: {
    async isLoaded(loaded) {
      if (loaded) {
        this.setLoading(true);
        await this.getMachines();
        this.setLoading(false);
      }
    },
  },
  computed: {
    ...mapState('shopfloor', [
      'loading',
      'selectedView',
      'selectedDisplay',
      'selectedTheme',
      'machines',
    ]),
    isLoaded() {
      const isViewSelected = this.selectedView !== null;
      const isDisplaySelected = this.selectedDisplay !== null;
      const isThemeSelected = this.selectedTheme !== null;
      return isViewSelected
        && isDisplaySelected
        && isThemeSelected;
    },
  },
  methods: {
    ...mapMutations('shopfloor', ['setLoading', 'setMachine']),
    ...mapActions('shopfloor', ['getBusinessTime', 'getMachines']),
    sseInit() {
      this.sseClient = new EventSource('/sse/asm');
      this.readyState = this.sseClient.readyState;
      this.sseClient.onopen = () => {
        if (this.timeout != null) {
          clearTimeout(this.timeout);
        }
      };
      this.sseClient.addEventListener('shift', (e) => {
        this.readyState = e.target.readyState;
        const eventData = JSON.parse(JSON.parse(e.data));
        this.setEventData(eventData);
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
    setEventData(data) {
      const {
        elementName, machinename, planid, partname, qty, target, updatedAt, actm_sum: runtime, sctm,
      } = data;
      if (elementName === 'cycletime') {
        this.machines.forEach((m, index) => {
          if (m.machinename === machinename) {
            const payload = {
              ...m,
              updatedat: updatedAt,
            };
            if (planid === m.planid) {
              let productions = [...m.production];
              const partIndex = m.production.findIndex((prod) => prod.partname === partname);
              if (partIndex > -1) {
                productions[partIndex].produced = qty;
              } else {
                productions = [...productions, {
                  partname,
                  produced: qty,
                  rejected: 0,
                  target,
                }];
              }
              payload.production = productions;
            } else {
              payload.planid = planid;
              payload.runtime = runtime;
              payload.stdcycletime = sctm;
            }
            this.setMachine({ index, payload });
          }
        });
      }
      // if element name rejection - fetch from rejection element
      // if element name downtime - update machine record
    },
  },
};
</script>
