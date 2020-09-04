<template>
  <validation-observer #default="{ passes }">
    <v-form @submit.prevent="passes(onLogin)">
      <v-card-text>
        <identifier-input
          id="identifier_input"
          :loading="loading"
          v-model="identifier"
          @on-update="setIdentifier"
        />
        <validation-provider
          rules="required"
          name="password"
          #default="{ errors }"
        >
          <v-text-field
            id="password_input"
            type="password"
            v-model="password"
            :disabled="loading"
            hide-details="auto"
            :error-messages="errors"
            :label="$t('login.password')"
            autocomplete="current-password"
            prepend-icon="$password"
          ></v-text-field>
        </validation-provider>
        <p class="text-right ma-0 pa-0 px-1">
          <v-btn
            text
            small
            color="primary"
            id="forgot_password_btn"
            :disabled="loading"
            @click="resetPassword"
            class="text-none pa-0"
          >
            {{ $t('login.forgotPassword') }}
          </v-btn>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          rounded
          id="login_btn"
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
        >
          <v-icon
            left
            v-text="'$login'"
          ></v-icon>
          {{ $t('login.login') }}
        </v-btn>
      </v-card-actions>
      <v-card-text class="text-center py-0">
        <span>{{ $t('helper.or') }}</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          id="login_otp_btn"
          class="text-none"
          :disabled="loading"
          @click="$emit('login-with-otp')"
        >
          {{ $t('login.loginWithOtp') }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'LoginWithPassword',
  components: {
    IdentifierInput,
  },
  data() {
    return {
      prefix: '',
      password: '',
      identifier: '',
      loading: false,
      isMobile: false,
    };
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions('user', ['getMySolutions']),
    resetPassword() {
      this.$router.push({ name: 'forgot-password' });
    },
    setIdentifier({ isMobile, prefix }) {
      this.isMobile = isMobile;
      this.prefix = prefix;
    },
    async onLogin() {
      this.loading = true;
      const payload = {
        identifier: this.isMobile
          ? `${this.prefix}${this.identifier}`
          : this.identifier,
        password: this.password,
      };
      const authenticated = await this.authenticate(payload);
      if (authenticated) {
        await this.getMySolutions();
        this.$emit('success');
      }
      this.loading = false;
    },
  },
};
</script>
