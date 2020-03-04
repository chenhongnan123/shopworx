<template>
  <swx-account-menu
    :fullName="fullName"
    :items="items"
    @logout="logout"
    @setActiveSite="setActiveSite"
    @toggleDarkMode="toggleDarkMode"
  ></swx-account-menu>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import SwxAccountMenu from '@shopworx/ui-components/navbar/SwxAccountMenu.vue';

export default {
  name: 'OnboardingAccountMenu',
  components: {
    SwxAccountMenu,
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('user', ['activeSite']),
    ...mapGetters('user', ['fullName', 'sites', 'isOnboardingComplete']),
    items() {
      let items = [
        {
          header: 'account',
        },
        { divider: true },
        {
          title: 'logout',
          icon: '$logout',
          action: 'logout',
        },
      ];
      if (this.sites && this.sites.length > 1) {
        const site = this.sites.map((s) => ({
          id: s.id,
          title: s.description,
          icon: '$location',
          action: 'setActiveSite',
        }));
        items = [
          {
            header: 'sites',
          },
          ...site,
          { divider: true },
          ...items,
        ];
      }
      let additionalItems = [];
      if (this.isDark) {
        additionalItems = [{
          title: 'lightMode',
          icon: '$lightMode',
          action: 'toggleDarkMode',
        }];
      } else {
        additionalItems = [{
          title: 'darkMode',
          icon: '$darkMode',
          action: 'toggleDarkMode',
        }];
      }
      const index = items.findIndex((item) => item.header === 'account');
      items.splice(index + 1, 0, ...additionalItems);
      return items;
    },
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('helper', ['toggleIsDark']),
    ...mapActions('user', ['updateActiveSite']),
    async logout() {
      const success = await this.logoutUser();
      if (success) {
        this.$router.replace({ name: 'login' });
      }
    },
    async setActiveSite(id) {
      await this.updateActiveSite(id);
    },
    toggleDarkMode() {
      this.toggleIsDark();
    },
  },
};
</script>
