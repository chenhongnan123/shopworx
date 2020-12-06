<template>
  <div style="height:100%">
    <portal to="app-header">
      Home
    </portal>
    <v-container fluid>
      <v-row>
        <v-col cols="12" lg="6" xl="6">
          <pending-invites />
        </v-col>
        <v-col cols="12" lg="6" xl="6">
          <registered-tvs />
        </v-col>
        <v-col cols="12" lg="6" xl="6">
          <user-roles />
        </v-col>
        <v-col cols="12" lg="6" xl="6">
          <business-holidays />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PendingInvites from '@shopworx/ui-components/widgets/PendingInvites.vue';
import RegisteredTvs from '@shopworx/ui-components/widgets/RegisteredTvs.vue';
import UserRoles from '@shopworx/ui-components/widgets/UserRoles.vue';
import BusinessHolidays from '@shopworx/ui-components/widgets/BusinessHolidays.vue';

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
