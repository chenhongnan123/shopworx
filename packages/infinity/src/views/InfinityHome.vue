<template>
  <v-app v-if="!infinityLoading">
    <infinity-drawer
      :showDrawer="drawer"
      :items="items"
      :adminItems="adminItems"
      @set-drawer="setDrawer"
    />
    <infinity-header @toggle-drawer="toggleDrawer" />
    <infinity-insights />
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
    <infinity-bottom v-if="$vuetify.breakpoint.smAndDown" />
  </v-app>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapState,
  mapMutations,
} from 'vuex';
import InfinityHeader from '@/components/core/InfinityHeader.vue';
import InfinityDrawer from '@/components/core/InfinityDrawer.vue';
import InfinityBottom from '@/components/core/InfinityBottom.vue';
import InfinityInsights from '@/components/insights/Insights.vue';

export default {
  name: 'InfinityHome',
  components: {
    InfinityHeader,
    InfinityDrawer,
    InfinityBottom,
    InfinityInsights,
  },
  async created() {
    this.setInfinityLoading(true);
    if (!this.me) {
      await this.getMe();
    }
    if (this.me) {
      if (!this.isAccountUpdated) {
        this.$router.replace({ name: 'welcome' });
      } else if (!this.isPasswordUpdated) {
        this.$router.replace({ name: 'register' });
      } else if (!this.isOnboardingComplete) {
        this.$router.replace({ name: 'setup' });
      } else if (this.mySolutions && !this.mySolutions.length) {
        await this.getMySolutions();
        this.redirect(this.$route.fullPath);
      } else {
        this.redirect(this.$route.fullPath);
      }
    }
    this.setInfinityLoading(false);
  },
  watch: {
    $route(val) {
      this.setExtendedHeader(false);
      this.redirect(val.fullPath);
    },
  },
  data() {
    return {
      drawer: null,
    };
  },
  computed: {
    ...mapState('helper', ['infinityLoading']),
    ...mapState('user', ['me', 'mySolutions']),
    ...mapGetters('user', [
      'modules',
      'isAccountUpdated',
      'isPasswordUpdated',
      'isOnboardingComplete',
    ]),
    items() {
      return this.modules && this.modules.items
        ? this.modules.items
        : [];
    },
    adminItems() {
      return this.modules && this.modules.adminItems
        ? this.modules.adminItems
        : [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader', 'setInfinityLoading']),
    ...mapActions('user', ['getMe', 'getMySolutions']),
    redirect(path) {
      if (path === '/') {
        const index = this.items.findIndex((elem) => elem.title);
        const { to } = this.items.find((item, i) => index === i);
        this.$router.push({ path: to });
      }
    },
    setDrawer(val) {
      this.drawer = val;
    },
    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },
};
</script>
