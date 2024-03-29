<template>
  <v-card class="transparent" flat>
    <user-avatar />
    <validation-observer #default="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(onUpdateProfile)">
        <v-card-text class="py-0 pt-2">
          <v-row>
            <v-col cols="12" sm="6" class="py-0">
              <validation-provider
                rules="required"
                name="firstName"
                #default="{ errors }"
              >
                <v-text-field
                  filled
                  type="text"
                  id="firstName"
                  v-model="firstName"
                  :disabled="loading"
                  :error-messages="errors"
                  autocomplete="given-name"
                  prepend-icon="$identifier"
                  :label="$t('user.profile.firstName')"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" sm=6 class="py-0">
              <validation-provider
                rules="required"
                name="lastName"
                #default="{ errors }"
              >
                <v-text-field
                  filled
                  type="text"
                  id="lastName"
                  v-model="lastName"
                  :disabled="loading"
                  :error-messages="errors"
                  autocomplete="family-name"
                  :class="$vuetify.breakpoint.xsOnly ? 'ml-8' : ''"
                  :label="$t('user.profile.lastName')"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <validation-provider
            name="email"
            :rules="emailRules"
            #default="{ errors }"
          >
            <v-text-field
              id="email"
              filled
              type="email"
              v-model="email"
              :disabled="loading"
              autocomplete="email"
              :error-messages="errors"
              prepend-icon="$email"
              :label="$t('user.profile.email')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            name="phone"
            :rules="phoneRules"
            #default="{ errors }"
          >
            <v-text-field
              filled
              type="tel"
              id="phone"
              prefix="+91"
              v-model="phone"
              autocomplete="tel"
              :disabled="loading"
              :error-messages="errors"
              prepend-icon="$phone"
              :label="$t('user.profile.phone')"
            ></v-text-field>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
import { mapState, mapActions, mapMutations } from 'vuex';
import UserAvatar from '@/components/user/settings/UserAvatar.vue';

export default {
  name: 'UserProfile',
  components: {
    UserAvatar,
  },
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
    async onUpdateProfile() {
      this.loading = true;
      const payload = {
        userId: this.me.user.id,
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
