<template>
  <v-card class="transparent" flat>
    <user-avatar />
    <validation-observer #default="{ handleSubmit }" ref="form">
      <v-form @submit.prevent="handleSubmit(onUpdateProfile)" v-model="isValid">
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
              filled
              id="email"
              type="email"
              v-model="email"
              :disabled="loading"
              autocomplete="email"
              prepend-icon="$email"
              :error-messages="errors"
              :label="$t('user.profile.email')"
            ></v-text-field>
          </validation-provider>
          <div class="d-flex align-center">
            <country-selection
              :countryCode="prefix"
              @on-select="onSelectFlag"
              styles="margin-right: 10px; margin-top: -1rem;"
            />
            <v-text-field
              filled
              type="tel"
              id="phone"
              ref="phone"
              v-model="phone"
              :prefix="prefix"
              autocomplete="tel"
              :rules="phoneRules"
              :disabled="loading"
              :label="$t('user.profile.phone')"
            ></v-text-field>
            </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            class="text-none"
            id="updateAccount"
            :loading="loading"
            :disabled="!isValid"
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
import CountrySelection from '@/components/auth/CountrySelection.vue';
/* eslint-disable */
export default {
  name: 'UserProfile',
  components: {
    UserAvatar,
    CountrySelection,
  },
  data() {
    return {
      phone: '',
      email: '',
      lastName: '',
      firstName: '',
      prefix: '+91',
      isValid: false,
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
      if (this.phone) {
        if (this.prefix === '+91') {
          return [
            v => /^[7-9][0-9]{9}$/.test(v) || 'Phone must be valid',
          ];
        }
        if (this.prefix === '+86') {
          return [
            v => /^1[0-9]{10}$/.test(v) || 'Phone must be valid',
          ];
        }
        if (this.prefix === '+66') {
          return [
            v => /^[6,8,9][0-9]{8}$/.test(v) || 'Phone must be valid',
          ];
        }
        if (this.prefix === '+49') {
          return [
            v => /^1[0-9]{9,10}$/.test(v) || 'Phone must be valid',
          ];
        }
      }
      if (!this.email && !this.phone) {
        return [
           v => !!v || 'Phone or email is required',
          ];
      }
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
      this.prefix = user.phoneNumber
        ? `+${user.phoneNumber.substring(0, 2)}`
        : '+91';
    },
    async onUpdateProfile() {
      this.loading = true;
      const phoneNumber = this.phone ? `${this.prefix.slice(1)}${this.phone}` : null;
      const payload = {
        userId: this.me.user.id,
        emailId: this.email,
        phoneNumber,
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
    onSelectFlag(country) {
      this.prefix = country.code;
      this.phone = this.phone + ' ';
      this.$nextTick(() => {
        this.$refs.phone.validate();
        this.phone = this.phone.trim();
      });
    },
  },
};
</script>
