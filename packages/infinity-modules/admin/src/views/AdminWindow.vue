<template>
  <div>
    <customer-account v-if="id === 'account'" />
    <alert-configuration v-else-if="id === 'alerts'" />
    <user-roles v-else-if="id === 'user-roles'" />
    <users v-else-if="id === 'users'" />
    <business-month-start v-if="id === 'fiscal-year-start'" />
    <business-working-days v-else-if="id === 'working-days'" />
    <business-hours v-else-if="id === 'shift-hours'" />
    <business-holidays v-else-if="id === 'holidays'" />
  </div>
</template>

<script>
import CustomerAccount from '../components/CustomerAccount.vue';
import AlertConfiguration from '../components/AlertConfiguration.vue';
import UserRoles from '../components/access-management/UserRoles.vue';
import Users from '../components/access-management/Users.vue';
import BusinessMonthStart from '../components/calendar/BusinessMonthStart.vue';
import BusinessWorkingDays from '../components/calendar/BusinessWorkingDays.vue';
import BusinessHours from '../components/calendar/BusinessHours.vue';
import BusinessHolidays from '../components/calendar/BusinessHolidays.vue';

export default {
  name: 'AdminWindow',
  components: {
    CustomerAccount,
    AlertConfiguration,
    UserRoles,
    Users,
    BusinessMonthStart,
    BusinessWorkingDays,
    BusinessHours,
    BusinessHolidays,
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
