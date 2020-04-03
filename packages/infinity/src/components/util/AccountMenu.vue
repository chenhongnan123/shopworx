<template>
  <v-menu
    bottom
    offset-y
    z-index="9999"
    transition="slide-y-transition"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        v-on="on"
        class="text-none"
      >
        <v-avatar
          size="36"
          v-on="on"
          color="secondary"
        >
          <v-icon v-text="'$account'"></v-icon>
        </v-avatar>
      </v-btn>
    </template>
    <v-list dense nav>
      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="index"
          v-text="$t(`account.${item.header}`)"
          class="mb-0 pb-0"
        ></v-subheader>
        <v-divider
          v-else-if="item.divider"
          :key="index"
          class="pb-1"
        ></v-divider>
        <v-list-item
          v-else-if="item.id"
          :class="activeSite === item.id ? 'secondary white--text' : ''"
          :key="index"
          @click="setActiveSite(item.id)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
        <v-list-item
          v-else
          :key="index"
          @click="action(item.action)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title
            v-text="$t(`account.${item.title}`)"
          ></v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'AccountMenu',
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
    action(actionName) {
      this[`${actionName}`]();
    },
    goToProfile() {
      this.$router.push({ name: 'profile' });
    },
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
