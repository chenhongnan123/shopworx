<template>
  <settings-layout :items="items" windowRouteName="userWindow" headerTitle="My Profile Settings">
    <template #settingsCard>
      <v-card flat class="transparent text-center">
        <v-card-text>
          <v-avatar size="74" color="secondary">
            <v-icon x-large v-text="'$account'"></v-icon>
          </v-avatar>
        </v-card-text>
        <v-card-text class="py-0">
          <div class="headline font-weight-medium">
            {{ operator.operatorname }}
          </div>
          <div class="title font-weight-regular">
            {{ operator.positionname }}
          </div>
          <div class="title font-weight-regular">{{ operator.departmentname }}</div>
        </v-card-text>
        <v-card-actions style="justify-content: center;">
          <v-btn color="red" id="logout" @click="logout" class="text-none">
            {{ $t('account.logout') }}
          </v-btn>
        </v-card-actions>
        <div class="mt-2">v{{ version }}</div>
      </v-card>
      <v-divider></v-divider>
    </template>
    <v-fade-transition hide-on-leave>
      <user-window />
    </v-fade-transition>
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
          title: 'user.preferences.title',
          icon: '$tune',
          to: 'preferences',
        },
      ],
    };
  },
  computed: {
    ...mapState('helper', ['version']),
    ...mapState('user', ['activeSite']),
    ...mapGetters('user', ['fullName', 'sites', 'currentSite', 'customer', 'role']),
    ...mapState('auth', ['operator']),
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
    async toggle() {
      window.location.href = 'file:///android_asset/www/index.html';
      // const success = await this.logoutUser();
      // if (success) {

      // }
    },
    async setActiveSite(id) {
      await this.updateActiveSite(id);
    },
  },
};
</script>
