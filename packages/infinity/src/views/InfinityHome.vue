<template>
  <v-app>
    <template v-if="loading">
      <v-content :class="$vuetify.theme.dark ? '#121212' : 'white'">
        <v-container fill-height>
          <v-row
            align="center"
            justify="center"
            :no-gutters="$vuetify.breakpoint.smAndDown"
          >
            <span class="display-3">
              Loading...
            </span>
          </v-row>
        </v-container>
      </v-content>
    </template>
    <template v-else>
      <infinity-drawer
        :showDrawer="drawer"
        :items="items"
        :adminItems="adminItems"
        @set-drawer="setDrawer"
      />
      <infinity-header @toggle-drawer="toggleDrawer" />
      <v-content :class="$vuetify.theme.dark ? '#121212' : 'white'">
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-content>
      <infinity-bottom v-if="$vuetify.breakpoint.smAndDown" />
    </template>
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

export default {
  name: 'InfinityHome',
  components: {
    InfinityHeader,
    InfinityDrawer,
    InfinityBottom,
  },
  async created() {
    this.loading = true;
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
    this.loading = false;
  },
  watch: {
    $route(val) {
      this.setExtendedHeader(false);
      this.redirect(val.fullPath);
    },
  },
  data() {
    return {
      drawer: true,
      loading: false,
    };
  },
  computed: {
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
    ...mapMutations('helper', ['setExtendedHeader']),
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
