<template>
  <v-card class="transparent" flat>
    <v-row no-gutters>
      <v-col cols="3" sm="2">
        <v-avatar
          size="96"
          color="secondary"
        >
          <v-icon
            x-large
            v-text="'$account'"
          ></v-icon>
        </v-avatar>
      </v-col>
      <v-col class="my-auto">
        <div class="display-1 font-weight-medium">
          {{ fullName }}
        </div>
        <div class="title">
          {{ customer }}, {{ currentSite }}
        </div>
      </v-col>
    </v-row>
    <validation-observer #default="{ passes }">
      <v-form @submit.prevent="passes(onUpdateProfile)">
        <v-card-text class="py-0">
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
              prepend-inner-icon="$identifier"
              :label="$t('user.profile.firstName')"
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
              prepend-inner-icon="$identifier"
              :label="$t('user.profile.lastName')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="email"
            :rules="emailRules"
            #default="{ errors }"
          >
            <v-text-field
              id="email"
              type="email"
              v-model="email"
              :disabled="loading"
              autocomplete="email"
              :error-messages="errors"
              prepend-inner-icon="$email"
              :label="$t('user.profile.email')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="phone"
            :rules="phoneRules"
            #default="{ errors }"
          >
            <v-text-field
              type="tel"
              id="phone"
              prefix="+91"
              v-model="phone"
              autocomplete="tel"
              :disabled="loading"
              :error-messages="errors"
              prepend-inner-icon="$phone"
              :label="$t('user.profile.phone')"
            ></v-text-field>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            @click="onReset"
            color="primary"
            class="text-none"
            :disabled="loading"
          >
            {{ $t('user.profile.reset') }}
          </v-btn>
          <v-btn
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
            {{ $t('user.profile.update') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import {
  mapGetters,
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'UserProfile',
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
    ...mapGetters('user', ['fullName', 'sites', 'currentSite', 'customer']),
    emailRules() {
      return this.phone ? 'email' : 'required|email';
    },
    phoneRules() {
      return this.email ? 'digits:10' : 'required|digits:10';
    },
  },
  methods: {
    ...mapActions('user', ['updateUser']),
    ...mapMutations('helper', ['setAlert']),
    assignUser(user) {
      this.firstName = user.firstname;
      this.lastName = user.lastname;
      this.email = user.emailId;
      this.phone = user.phoneNumber
        ? user.phoneNumber.substring(2)
        : user.phoneNumber;
    },
    onReset() {
      this.assignUser(this.me.user);
    },
    async onUpdateProfile() {
      this.loading = true;
      const payload = {
        emailId: this.email,
        phoneNumber: `91${this.phone}`,
        lastname: this.lastName,
        firstname: this.firstName,
      };
      const updated = await this.updateUser(payload);
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATED',
        });
      }
      this.loading = false;
    },
  },
};
</script>
