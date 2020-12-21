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
        }, {
          icon: 'mdi-message-text-outline',
          title: 'customerSms',
        }, {
          icon: 'mdi-webhook',
          title: 'customerWebhooks',
        }, {
          icon: 'mdi-shield-key-outline',
          title: 'customerSolutions',
        }, {
          icon: 'mdi-account-multiple-outline',
          title: 'customerUsers',
        }, {
          icon: 'mdi-rocket-launch-outline',
          title: 'customerDeployment',
        }, {
          icon: 'mdi-database-export-outline',
          title: 'customerData',
        }],
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
      adminItems: [],
    };
  },
  computed: {
    ...mapState('helper', ['originLoading']),
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    redirect(path) {
      if (path === '/') {
        this.$router.push({ name: 'customerDeployment' });
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
