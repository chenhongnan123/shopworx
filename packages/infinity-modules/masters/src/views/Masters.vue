<template>
  <div>
    <settings-layout
      v-if="!loading"
      :items="masterItems"
      headerTitle="Master Data"
      windowRouteName="masterWindow"
    >
      <master-window />
    </settings-layout>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';
import MasterWindow from './MasterWindow.vue';

export default {
  name: 'Admin',
  components: {
    SettingsLayout,
    MasterWindow,
  },
  data() {
    return {
      loading: false,
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
  computed: {
    ...mapGetters('masters', ['masterItems']),
  },
  async created() {
    this.loading = true;
    await this.getElements();
    await this.getAssets();
    this.loading = false;
  },
  methods: {
    ...mapActions('masters', ['getElements', 'getAssets']),
  },
};
</script>
