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
import {
  mapActions,
  mapMutations,
  mapState,
  mapGetters,
} from 'vuex';

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
      interval: null,
      timeInterval: null,
    };
  },
  async created() {
    this.setShowHeaderButtons(true);
    const self = this;
    this.setLoading(true);
    await this.getShifts();
    await this.getBusinessTime();
    this.timeInterval = setInterval(async () => {
      await self.getBusinessTime();
    }, 60000);
    this.interval = setInterval(() => {
      const x = new Date().getTime();
      const c = this.getRandomNumber({ min: 1, max: 10 });
      const p = this.getRandomNumber({ min: 1, max: 10 });
      const v = this.getRandomNumber({ min: 1, max: 10 });
      const s = this.getRandomNumber({ min: 1, max: 13 });
      const m = this.getRandomNumber({ min: 1, max: 500 });
      this.setParameters({
        x,
        c,
        p,
        v,
        s,
        m,
      });
    }, 2000);
    this.setLoading(false);
  },
  beforeDestroy() {
    clearInterval(this.interval);
    clearInterval(this.timeInterval);
  },
  computed: {
    ...mapGetters('processDashboard', ['getRandomNumber']),
    ...mapState('processDashboard', [
      'loading',
    ]),
  },
  methods: {
    ...mapMutations('processDashboard', [
      'setLoading',
      'setParameters',
    ]),
    ...mapMutations('helper', [
      'setShowHeaderButtons',
    ]),
    ...mapActions('processDashboard', [
      'getBusinessTime',
      'getShifts',
    ]),
  },
};
</script>
