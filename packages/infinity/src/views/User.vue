<template>
  <settings-layout
    :items="items"
    windowRouteName="userWindow"
    headerTitle="My Profile Settings"
  >
    <template #settingsCard>
      <v-card flat class="transparent text-center">
        <v-card-text>
          <v-avatar
            size="74"
            color="secondary"
          >
            <v-icon
              x-large
              v-text="'$account'"
            ></v-icon>
          </v-avatar>
        </v-card-text>
        <v-card-text class="py-0">
          <div class="headline font-weight-medium">
            {{ fullName }}
          </div>
          <div class="title font-weight-regular">
            {{ role }}
          </div>
          <div class="title font-weight-regular">
            {{ customer }}, {{ currentSite }}
          </div>
        </v-card-text>
        <v-card-text>
          <v-btn
            text
            outlined
            id="logout"
            @click="logout"
            class="text-none"
          >
            {{ $t('account.logout') }}
          </v-btn>
          <div class="mt-2">
            v{{ version }}
          </div>
        </v-card-text>
      </v-card>
      <v-card
        flat
        class="transparent"
        v-if="sites && sites.length > 1"
      >
        <v-card-text class="pa-0">
          <v-list>
            <v-subheader
              v-text="$t('account.sites')"
              class="mb-0 pb-0 text-uppercase"
            ></v-subheader>
            <template v-for="(site, index) in sites">
              <v-list-item
                :key="index"
                color="primary"
                @click="setActiveSite(site.id)"
                :class="activeSite === site.id ? 'secondary' : ''"
              >
                <v-list-item-icon>
                  <v-icon v-text="'$location'"></v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="site.description"></v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-card-text>
      </v-card>
      <v-divider></v-divider>
    </template>
    <user-window />
  </settings-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';
import UserWindow from '@/components/user/UserWindow.vue';

export default {
  name: 'Admin',
  components: {
    SettingsLayout,
    UserWindow,
  },
  data() {
    return {
      items: [
        {
          header: 'user.general',
        },
        {
          title: 'user.profile.title',
          icon: '$profile',
          to: 'profile',
        },
        {
          title: 'user.preferences.title',
          icon: '$tune',
          to: 'preferences',
        },
        { divider: true },
        {
          header: 'user.security',
        },
        {
          title: 'user.password.title',
          icon: '$password',
          to: 'password',
        },
        {
          title: 'user.auditLog.title',
          icon: '$log',
          to: 'audit-log',
        },
      ],
    };
  },
  computed: {
    ...mapState('helper', ['version']),
    ...mapState('user', ['activeSite']),
    ...mapGetters('user', ['fullName', 'sites', 'currentSite', 'customer', 'role']),
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
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
  },
};
</script>
