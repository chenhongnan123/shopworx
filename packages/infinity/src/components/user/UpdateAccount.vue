<template>
  <v-card flat class="transparent">
    <div class="display-1 mb-4 font-weight-medium text-center primary--text">
      {{ $t('register.account.title') }}
    </div>
    <validation-observer #default="{ passes }">
      <v-form @submit.prevent="passes(onUpdateAccount)">
        <v-card-text>
          <validation-provider
            rules="required"
            name="First name"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              v-model="firstName"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="given-name"
              prepend-inner-icon="$identifier"
              :label="$t('register.account.firstName')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required"
            name="Last name"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              v-model="lastName"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="family-name"
              prepend-inner-icon="$identifier"
              :label="$t('register.account.lastName')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required|email"
            name="Email"
            #default="{ errors }"
          >
            <v-text-field
              type="email"
              v-model="email"
              :disabled="loading"
              autocomplete="email"
              :error-messages="errors"
              prepend-inner-icon="$email"
              :label="$t('register.account.email')"
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
              v-model="phone"
              autocomplete="tel"
              :disabled="loading"
              :error-messages="errors"
              prepend-inner-icon="$phone"
              :label="$t('register.account.phone')"
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
            <v-icon
              left
              v-text="'$updateAccount'"
            ></v-icon>
            {{ $t('register.account.update') }}
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
        phoneNumber: `91${this.phone}`,
        lastname: this.lastName,
        firstname: this.firstName,
      };
      await this.updateUser(payload);
      this.loading = false;
    },
  },
};
</script>
