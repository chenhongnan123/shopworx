<template>
  <v-card flat class="transparent">
    <div class="display-1 mb-4 font-weight-medium text-center primary--text">
      Create your ShopWorx Password
    </div>
    <validation-observer #default="{ invalid, validated, passes }">
      <v-form @submit.prevent="passes(onAccountCreation)">
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
              prepend-inner-icon="mdi-lock-outline"
            ></v-text-field>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="primary"
            class="text-none"
            :loading="loading"
            :disabled="invalid || !validated"
          >
            <v-icon left>mdi-lock-outline</v-icon>
            Create password
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreatePassword',
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    async onCreateAccount() {
      this.loading = true;
      const payload = {
        userState: 'ACTIVE',
        password: this.password,
      };
      await this.updatePassword(payload);
      this.loading = false;
    },
  },
};
</script>
