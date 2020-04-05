<template>
  <settings-layout
    :items="items"
    windowRouteName="adminWindow"
    headerTitle="Admin Console"
  ></settings-layout>
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
          icon: '$account',
          to: 'account',
        },
        {
          title: 'admin.alerts.title',
          icon: '$alerts',
          to: 'alerts',
        },
        { divider: true },
        {
          header: 'admin.management',
        },
        {
          title: 'admin.userRoles.title',
          icon: '$userRoles',
          to: 'user-roles',
        },
        {
          title: 'admin.users.title',
          icon: '$users',
          to: 'users',
        },
        { divider: true },
        {
          header: 'admin.calendar',
        },
        {
          title: 'admin.fiscalYearStart.title',
          icon: '$fiscalYear',
          to: 'fiscal-year-start',
        },
        {
          title: 'admin.workingDays.title',
          icon: '$workingDays',
          to: 'working-days',
        },
        {
          title: 'admin.shiftHours.title',
          icon: '$shiftHours',
          to: 'shift-hours',
        },
        {
          title: 'admin.holidays.title',
          icon: '$holidays',
          to: 'holidays',
        },
        { divider: true },
        {
          header: 'admin.billing',
        },
        {
          title: 'admin.planDetails.title',
          icon: '$subscription',
          to: 'plan-details',
        },
        {
          title: 'admin.assets.title',
          icon: '$list',
          to: 'assets',
        },
      ],
    };
  },
};
</script>
