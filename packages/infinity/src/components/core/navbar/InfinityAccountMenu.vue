<template>
  <swx-account-menu
    :fullName="fullName"
    :items="items"
    @logout="logout"
    @goToProfile="goToProfile"
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
  name: 'AccountMenu',
  components: {
    SwxAccountMenu,
  },
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('user', ['activeSite']),
    ...mapGetters('user', ['fullName', 'sites']),
    items() {
      let items = [
        {
          header: 'account',
        },
        {
          title: 'profile',
          icon: '$profile',
          action: 'goToProfile',
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
      const index = items.findIndex((item) => item.title === 'profile');
      items.splice(index + 1, 0, ...additionalItems);
      return items;
    },
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    ...mapMutations('helper', ['toggleIsDark']),
    ...mapActions('user', ['updateActiveSite']),
    goToProfile() {
      this.$router.push({ name: 'user-profile' });
    },
    async logout() {
      try {
        const data = await this.logoutUser();
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          this.$router.replace({ name: 'login' });
        }
      } catch (e) {
        console.error(e);
      }
    },
    async setActiveSite(id) {
      try {
        const data = await this.updateActiveSite(id);
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        }
      } catch (e) {
        console.error(e);
      }
    },
    toggleDarkMode() {
      this.toggleIsDark();
    },
  },
};
</script>
