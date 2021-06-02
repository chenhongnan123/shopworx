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
        group: 'customers',
        icon: 'mdi-face-agent',
        children: [{
          icon: 'mdi-license',
          title: 'customerAssets',
          comingSoon: true,
        }, {
          icon: 'mdi-message-text-outline',
          title: 'customerSms',
          comingSoon: true,
        }, {
          icon: 'mdi-webhook',
          title: 'customerWebhooks',
          comingSoon: true,
        }, {
          icon: 'mdi-shield-key-outline',
          title: 'customerSolutions',
          comingSoon: true,
        }, {
          icon: 'mdi-account-multiple-outline',
          title: 'customerUsers',
          comingSoon: true,
        }, {
          icon: 'mdi-rocket-launch-outline',
          title: 'customerDeployment',
          comingSoon: false,
        }, {
          icon: 'mdi-database-export-outline',
          title: 'customerData',
          comingSoon: true,
        }, {
          icon: 'mdi-rocket-launch-outline',
          title: 'customerLogManagement',
          comingSoon: false,
        }],
      }, {
        title: 'industries',
        comingSoon: true,
        icon: 'mdi-domain',
      }, {
        title: 'solutions',
        comingSoon: true,
        icon: 'mdi-apps',
      }, {
        title: 'users',
        comingSoon: true,
        icon: 'mdi-account-group-outline',
      }, {
        header: 'devTools',
      }, {
        title: 'reports',
        comingSoon: true,
        icon: 'mdi-chart-line',
      }, {
        title: 'insights',
        comingSoon: true,
        icon: 'mdi-atom-variant',
      }, {
        title: 'dashboards',
        comingSoon: true,
        icon: 'mdi-view-dashboard-outline',
      }, {
        title: 'models',
        comingSoon: true,
        icon: 'mdi-memory',
      }],
      adminItems: [],
    };
  },
  computed: {
    ...mapState('helper', ['originLoading']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    redirect(path) {
      if (path === '/' || path === '/customer' || path === '/customer/') {
        this.$router.push({ name: 'customerAssets' });
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
