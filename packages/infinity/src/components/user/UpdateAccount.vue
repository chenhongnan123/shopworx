<template>
  <v-card flat class="transparent">
    <div class="display-1 mb-4 font-weight-medium text-center primary--text">
      {{ $t('register.account.title') }}
    </div>
    <validation-observer #default="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(onUpdateAccount)" v-model="isValid">
        <v-card-text>
          <validation-provider
            rules="required"
            name="firstName"
            #default="{ errors }"
          >
            <v-text-field
              type="text"
              id="first_name_input"
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
              id="last_name_input"
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
              id="email_input"
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
            name="phone"
            #default="{ errors }"
          >
            <div class="d-flex align-center">
              <country-selection
                :countryCode="prefix"
                @on-select="onSelectFlag"
                styles="margin-right: 10px;"
              />
              <!-- <v-menu v-if="prefix">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    style="margin-right: 10px; margin-top: -1rem;"
                  >
                    <img :src="require(`@shopworx/assets/flags/${flag}.svg`)" width="22" />
                  </div>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(country, i) in countries"
                    :key="i"
                    @click="onSelectFlag(country)"
                  >
                    <v-list-item-title class="d-flex">
                      <img
                        :src="require(`@shopworx/assets/flags/${country.flag}.svg`)"
                        width="22"
                        class="mr-2"
                      />
                      <span>{{ country.name }} ({{ country.code }})</span>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu> -->
              <v-text-field
                type="tel"
                ref="phone"
                id="phone_input"
                v-model="phone"
                :prefix="prefix"
                v-if="showPhone"
                autocomplete="tel"
                :disabled="loading"
                :rules="phoneRules"
                :error-messages="errors"
                :label="$t('register.account.phone')"
              ></v-text-field>
            </div>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            rounded
            type="submit"
            color="primary"
            class="text-none"
            id="update_account_btn"
            :loading="loading"
            :disabled="!isValid"
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
import CountrySelection from '@/components/auth/CountrySelection.vue';
/* eslint-disable */
export default {
  name: 'UpdateAccount',
  components: {
    CountrySelection,
  },
  data() {
    return {
      email: '',
      phone: '',
      prefix: '+91',
      lastName: '',
      firstName: '',
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
    async onUpdateAccount() {
      this.loading = true;
      const payload = {
        userId: this.me.user.id,
        userState: 'RESET',
        lastname: this.lastName,
        firstname: this.firstName,
      };
      if (this.email) {
        payload.emailId = this.email;
      }
      if (this.phone) {
        payload.phoneNumber = `${this.prefix.slice(1)}${this.phone}`;
      }
      await this.updateUser(payload);
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
