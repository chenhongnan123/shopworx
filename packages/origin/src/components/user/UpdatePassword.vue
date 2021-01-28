<template>
  <v-card flat class="transparent">
    <div class="display-1 mb-4 font-weight-medium text-center primary--text">
      {{ $t('register.password.title') }}
    </div>
    <validation-observer #default="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(onUpdatePassword)">
        <v-card-text>
          <validation-provider
            vid="createPassword"
            name="password"
            rules="required"
            #default="{ errors }"
          >
            <v-text-field
              type="password"
              id="new_password_input"
              v-model="password"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="new-password"
              prepend-icon="$password"
              :label="$t('register.password.newPassword')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="password"
            #default="{ errors }"
            rules="required|confirmed:createPassword"
          >
            <v-text-field
              type="password"
              :disabled="loading"
              id="confirm_password_input"
              :error-messages="errors"
              v-model="confirmPassword"
              autocomplete="new-password"
              prepend-icon="$password"
              :label="$t('register.password.confirmPassword')"
            ></v-text-field>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            rounded
            type="submit"
            color="primary"
            class="text-none"
            :loading="loading"
            id="update_password_btn"
          >
            <v-icon
              left
              v-text="'$password'"
            ></v-icon>
            {{ $t('register.password.update') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UpdatePassword',
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    async onUpdatePassword() {
      this.loading = true;
      const payload = {
        newpassword: this.password,
      };
      const updated = await this.updatePassword(payload);
      if (updated) {
        this.$emit('success');
      }
      this.loading = false;
    },
  },
};
</script>
