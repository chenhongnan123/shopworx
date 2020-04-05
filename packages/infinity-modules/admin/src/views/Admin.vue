<template>
  <settings-layout
    :items="items"
    windowRouteName="adminWindow"
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
          header: 'admin.general',
        },
        {
          title: 'admin.account.title',
          to: 'account',
        },
        {
          title: 'admin.notifications.title',
          to: 'notifications',
        },
        { divider: true },
        {
          header: 'admin.management',
        },
        {
          title: 'admin.userRoles.title',
          to: 'user-roles',
        },
        {
          title: 'admin.users.title',
          to: 'users',
        },
        { divider: true },
        {
          header: 'admin.calendar',
        },
        {
          title: 'admin.fiscalYearStart.title',
          to: 'fiscal-year-start',
        },
        {
          title: 'admin.workingDays.title',
          to: 'working-days',
        },
        {
          title: 'admin.shiftHours.title',
          to: 'shift-hours',
        },
        {
          title: 'admin.holidays.title',
          to: 'holidays',
        },
      ],
    };
  },
};
</script>
