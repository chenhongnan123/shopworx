<template>
  <v-card flat class="transparent">
    <div class="display-1 mb-4 font-weight-medium text-center primary--text">
      Update your ShopWorx Password
    </div>
    <validation-observer #default="{ passes }">
      <v-form @submit.prevent="passes(onUpdatePassword)">
        <v-card-text>
          <validation-provider
            vid="password"
            name="Password"
            rules="required"
            #default="{ errors }"
          >
            <v-text-field
              type="password"
              v-model="password"
              :disabled="loading"
              label="New password"
              :error-messages="errors"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-outline"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required|confirmed:password"
            name="Password"
            #default="{ errors }"
          >
            <v-text-field
              type="password"
              :disabled="loading"
              :error-messages="errors"
              label="Confirm password"
              v-model="confirmPassword"
              autocomplete="new-password"
              prepend-inner-icon="mdi-lock-outline"
            ></v-text-field>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            type="submit"
            color="primary"
            class="text-none"
            :loading="loading"
          >
            <v-icon left>mdi-lock-outline</v-icon>
            Update password
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
