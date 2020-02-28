<template>
  <div>
    <v-text-field
      outlined
      type="password"
      v-model="currentPassword"
      :label="$t('infinity.user.register.form.labels.password')"
    ></v-text-field>
    <v-text-field
      outlined
      type="password"
      v-model="newPassword"
      autocomplete="new-password"
      :label="$t('infinity.user.register.form.labels.newPassword')"
    ></v-text-field>
    <v-text-field
      outlined
      hide-details
      type="password"
      autocomplete="new-password"
      v-model="confirmNewPassword"
      :label="$t('infinity.user.register.form.labels.confirmNewPassword')"
    ></v-text-field>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegisterPasswordForm',
  data() {
    return {
      currentPassword: null,
      newPassword: null,
      confirmNewPassword: null,
    };
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    async update() {
      try {
        const data = await this.updatePassword({
          currentpassword: this.currentPassword,
          newpassword: this.newPassword,
        });
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
          return false;
        }
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
};
</script>
