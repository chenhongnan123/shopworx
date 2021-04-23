<template>
  <v-app v-if="!infinityLoading">
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
    <infinity-bottom />
  </v-app>
</template>

<script>
// prettier-ignore
import {
  mapActions,
  mapGetters,
  mapState,
  mapMutations,
} from 'vuex';
import InfinityBottom from '@/components/core/InfinityBottom.vue';

export default {
  name: 'InfinityHome',
  components: {
    InfinityBottom,
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
      items: [
        {
          icon: 'mdi-calendar-multiselect',
          title: 'calendar',
        },
        {
          icon: 'mdi-format-list-bulleted-square',
          title: 'list',
        },
      ],
      adminItems: [],
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
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader', 'setInfinityLoading']),
    ...mapActions('user', ['getMe', 'getMySolutions']),
    redirect(path) {
      if (path === '/') {
        // const index = this.items.findIndex((elem) => elem.title);
        // const { to } = this.items.find((item, i) => index === i);
        this.$router.push({ path: '/dashboard' });
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
