<template>
  <div>
    <user-profile v-if="id === 'profile'" />
    <user-preferences v-else-if="id === 'preferences'" />
    <user-password v-else-if="id === 'password'" />
    <user-audit-log v-else-if="id === 'audit-log'" />
  </div>
</template>

<script>
import UserProfile from '@/components/user/settings/UserProfile.vue';
import UserPreferences from '@/components/user/settings/UserPreferences.vue';
import UserPassword from '@/components/user/settings/UserPassword.vue';
import UserAuditLog from '@/components/user/settings/UserAuditLog.vue';

export default {
  name: 'UserWindow',
  components: {
    UserProfile,
    UserPreferences,
    UserPassword,
    UserAuditLog,
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
