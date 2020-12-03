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
  async created() {
    this.setLoading(true);
    await this.getBusinessTime();
    if (this.isLoaded) {
      await this.getMachines();
    }
    this.setLoading(false);
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
    ...mapMutations('shopfloor', ['setLoading']),
    ...mapActions('shopfloor', ['getBusinessTime', 'getMachines']),
  },
};
</script>
