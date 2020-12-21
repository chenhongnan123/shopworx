<template>
  <v-app v-if="!originLoading">
    <origin-drawer
      :showDrawer="drawer"
      :items="items"
      :adminItems="adminItems"
      @set-drawer="setDrawer"
    />
    <origin-header @toggle-drawer="toggleDrawer" />
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
    <origin-bottom v-if="$vuetify.breakpoint.smAndDown" />
  </v-app>
</template>

<script>
import {
  mapState,
  mapMutations,
} from 'vuex';
import OriginHeader from '@/components/core/OriginHeader.vue';
import OriginDrawer from '@/components/core/OriginDrawer.vue';
import OriginBottom from '@/components/core/OriginBottom.vue';

export default {
  name: 'OriginHome',
  components: {
    OriginHeader,
    OriginDrawer,
    OriginBottom,
  },
  async created() {
    this.redirect(this.$route.fullPath);
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
      items: [{
        title: 'customers',
        icon: 'mdi-face',
      }, {
        title: 'industries',
        icon: 'mdi-domain',
      }, {
        title: 'solutions',
        icon: 'mdi-apps',
      }, {
        title: 'users',
        icon: 'mdi-account-group-outline',
      }, {
        header: 'devTools',
      }, {
        title: 'reports',
        icon: 'mdi-chart-line',
      }, {
        title: 'insights',
        icon: 'mdi-atom-variant',
      }, {
        title: 'dashboards',
        icon: 'mdi-view-dashboard-outline',
      }, {
        title: 'models',
        icon: 'mdi-memory',
      }],
      adminItems: [{
        title: 'customerSupport',
        icon: 'mdi-face-agent',
        external: true,
      }],
    };
  },
  computed: {
    ...mapState('helper', ['originLoading']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
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
