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
            name="firstName"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              id="firstName"
              v-model="firstName"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="given-name"
              prepend-icon="$identifier"
              :label="$t('register.account.firstName')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required"
            name="lastName"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              id="lastName"
              v-model="lastName"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="family-name"
              prepend-icon="$identifier"
              :label="$t('register.account.lastName')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="email"
            name="email"
            #default="{ errors }"
          >
            <v-text-field
              id="email"
              type="email"
              v-model="email"
              v-if="showEmail"
              :disabled="loading"
              autocomplete="email"
              :error-messages="errors"
              prepend-icon="$email"
              :label="$t('register.account.email')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="digits:10"
            name="phone"
            #default="{ errors }"
          >
            <v-text-field
              type="tel"
              id="phone"
              prefix="+91"
              v-model="phone"
              v-if="showPhone"
              autocomplete="tel"
              :disabled="loading"
              :error-messages="errors"
              prepend-icon="$phone"
              :label="$t('register.account.phone')"
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
            id="updateAccount"
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
import { mapActions, mapState } from 'vuex';

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
  created() {
    if (this.me && this.me.user) {
      this.assignUser(this.me.user);
    }
  },
  watch: {
    me() {
      this.assignUser(this.me.user);
    },
  },
  computed: {
    ...mapState('user', ['me']),
    showEmail() {
      let show = false;
      if (this.me && this.me.user) {
        show = !this.me.user.emailId;
      }
      return show;
    },
    showPhone() {
      let show = false;
      if (this.me && this.me.user) {
        show = !this.me.user.phoneNumber;
      }
      return show;
    },
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    assignUser(user) {
      this.firstName = user.firstname;
      this.lastName = user.lastname;
      this.email = user.emailId;
      this.phone = user.phoneNumber
        ? user.phoneNumber.substring(2)
        : user.phoneNumber;
    },
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
