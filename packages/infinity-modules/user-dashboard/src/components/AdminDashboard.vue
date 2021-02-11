<template>
  <div style="height:100%">
    <v-row>
      <v-col cols="12" lg="6" xl="6">
        <pending-invites />
      </v-col>
      <v-col cols="12" lg="6" xl="6">
        <user-roles />
      </v-col>
      <v-col cols="12" lg="6" xl="6">
        <registered-tvs />
      </v-col>
      <v-col cols="12" lg="6" xl="6">
        <business-holidays />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PendingInvites from '@shopworx/ui-components/widgets/users/PendingInvites.vue';
import RegisteredTvs from '@shopworx/ui-components/widgets/devices/RegisteredTvs.vue';
import UserRoles from '@shopworx/ui-components/widgets/users/UserRoles.vue';
import BusinessHolidays from '@shopworx/ui-components/widgets/calendar/BusinessHolidays.vue';

export default {
  name: 'AdminDashboard',
  components: {
    PendingInvites,
    RegisteredTvs,
    UserRoles,
    BusinessHolidays,
  },
};
</script>
