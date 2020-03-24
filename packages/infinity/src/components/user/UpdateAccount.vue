<template>
  <v-card flat class="transparent">
    <div class="display-1 mb-4 font-weight-medium text-center primary--text">
      Update your ShopWorx Account
    </div>
    <validation-observer #default="{ invalid, validated, passes }">
      <v-form @submit.prevent="passes(onUpdateAccount)">
        <v-card-text>
          <validation-provider
            rules="required"
            name="First name"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              label="First name"
              v-model="firstName"
              :disabled="loading"
              :error-messages="errors"
              prepend-inner-icon="mdi-account-outline"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required"
            name="Last name"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              label="Last name"
              v-model="lastName"
              :disabled="loading"
              :error-messages="errors"
              prepend-inner-icon="mdi-account-outline"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required|email"
            name="Email"
            #default="{ errors }"
          >
            <v-text-field
              type="email"
              label="Email"
              v-model="email"
              :disabled="loading"
              :error-messages="errors"
              prepend-inner-icon="mdi-email-outline"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required|digits:10"
            name="Phone"
            #default="{ errors }"
          >
            <v-text-field
              type="tel"
              prefix="+91"
              label="Phone"
              v-model="phone"
              :disabled="loading"
              :error-messages="errors"
              prepend-inner-icon="mdi-phone-outline"
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
            :disabled="invalid || !validated"
          >
            <v-icon left>mdi-account-check-outline</v-icon>
            Update account
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'UpdateAccount',
  data() {
    return {
      email: '',
      phone: '',
      lastName: '',
      firstName: '',
      loading: false,
    };
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    async onUpdateAccount() {
      this.loading = true;
      const payload = {
        userState: 'RESET',
        emailId: this.email,
        phoneNumber: this.phone,
        lastname: this.lastName,
        firstname: this.firstName,
      };
      await this.updateUser(payload);
      this.loading = false;
    },
  },
};
</script>
