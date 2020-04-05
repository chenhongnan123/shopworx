<template>
  <settings-layout
    :items="items"
    windowRouteName="userWindow"
  >
    <portal to="app-header">
      <v-toolbar-title class="headline font-weight-medium">
        Admin Console
      </v-toolbar-title>
    </portal>
    <router-view />
  </settings-layout>
</template>

<script>
import SettingsLayout from '@/components/layout/SettingsLayout.vue';

export default {
  name: 'Admin',
  components: {
    SettingsLayout,
  },
  data() {
    return {
      items: [
        {
          header: 'user.general',
        },
        {
          title: 'user.profile.title',
          to: 'profile',
        },
        {
          title: 'user.preferences.title',
          to: 'preferences',
        },
        { divider: true },
        {
          header: 'user.security',
        },
        {
          title: 'user.password.title',
          to: 'password',
        },
        {
          title: 'user.auditLog.title',
          to: 'audit-log',
        },
      ],
    };
  },
};
</script>
