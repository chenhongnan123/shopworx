<template>
  <v-menu bottom offset-y z-index="9999" transition="slide-y-transition">
    <template #activator="{ on: menu }">
      <v-tooltip bottom>
        <template #activator="{ on: tooltip }">
          <v-btn icon v-on="{ ...tooltip, ...menu }">
            <v-avatar size="36" color="secondary">
              <v-icon
                v-text="'$account'"
                :color="$vuetify.theme.dark ? 'white' : '#212121'"
              ></v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <span class="text-center">
          <div class="font-weight-medium">{{ operator.name }}</div>
          <div>{{ operator.positionname }}</div>
          <div>{{ operator.departmentname }}</div>
        </span>
      </v-tooltip>
    </template>
    <v-list dense>
      <template v-for="(item, index) in items">
        <v-subheader
          :key="index"
          v-if="item.header"
          class="mb-0 pb-0 text-uppercase"
          v-text="$t(`account.${item.header}`)"
        ></v-subheader>
        <v-divider :key="index" class="pb-1" v-else-if="item.divider"></v-divider>
        <v-list-item
          :key="index"
          v-else-if="item.id"
          @click="setActiveSite(item.id)"
          :class="activeSite === item.id ? 'secondary' : ''"
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
        <v-list-item v-else :key="index" @click="action(item.action)">
          <v-list-item-title v-text="$t(`account.${item.title}`)"></v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
// prettier-ignore
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'InfinityAccount',
  computed: {
    ...mapState('helper', ['isDark']),
    ...mapState('user', ['activeSite']),
    ...mapState('auth', ['operator']),
    ...mapGetters('user', ['fullName', 'sites', 'currentSite', 'customer', 'role']),
    items() {
      let items = [
        {
          header: 'account',
        },
        // {
        //   title: 'profile',
        //   icon: '$profile',
        //   action: 'goToUserProfile',
        // },
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
        additionalItems = [
          {
            title: 'lightMode',
            icon: '$lightMode',
            action: 'toggleDarkMode',
          },
        ];
      } else {
        additionalItems = [
          {
            title: 'darkMode',
            icon: '$darkMode',
            action: 'toggleDarkMode',
          },
        ];
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
    goToUserProfile() {
      this.$router.push({ name: 'user' });
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
