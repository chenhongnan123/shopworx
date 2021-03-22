<template>
  <validation-observer #default="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSubmit)" v-model="isValid">
      <v-card-text>
        <identifier-input
          id="identifier_input"
          :loading="loading || loadingOtp"
          v-model="identifier"
          @on-update="setIdentifier"
        />
        <validation-provider
          name="otp"
          v-if="otpGenerated"
          rules="required|max:4"
          #default="{ errors }"
        >
          <v-text-field
            id="otp_input"
            type="number"
            v-model="otp"
            :disabled="loading"
            hide-details="auto"
            :label="$t('login.otp')"
            :error-messages="errors"
            autocomplete="one-time-code"
            prepend-icon="$password"
          ></v-text-field>
        </validation-provider>
        <p
          v-if="otpGenerated"
          class="text-right ma-0 pa-0 px-1"
        >
          <v-btn
            text
            small
            id="resend_otp_btn"
            color="primary"
            v-if="!otpSent"
            :disabled="loading"
            :loading="loadingOtp"
            @click="onGenerateOtp"
            class="text-none pa-0"
          >
            {{ $t('login.resendOtp') }}
          </v-btn>
          <v-btn
            text
            small
            v-else
            disabled
            color="primary"
            class="text-none pa-0"
          >
            {{ $t('login.resendOtpIn', { time: resendTimer }) }}
          </v-btn>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          rounded
          id="send_otp_btn"
          type="submit"
          color="primary"
          class="text-none"
          v-if="!otpGenerated"
          :loading="loadingOtp"
          :disabled="!isValid"
        >
          <v-icon
            left
            v-text="'$send'"
          ></v-icon>
          {{ $t('login.sendOtp') }}
        </v-btn>
        <v-btn
          block
          v-else
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
          class="text-none"
          :disabled="loading"
          id="login_password_btn"
          @click="$emit('login-with-password')"
        >
          {{ $t('login.loginWithPassword') }}
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'LoginWithOtp',
  components: {
    IdentifierInput,
  },
  data() {
    return {
      otp: '',
      prefix: '',
      otpSent: false,
      identifier: '',
      loading: false,
      isMobile: false,
      resendTimer: 30,
      loadingOtp: false,
      otpGenerated: false,
      isValid: false,
    };
  },
  methods: {
    ...mapActions('auth', ['generateOtp', 'authenticateWithOtp']),
    ...mapActions('user', ['getMySolutions']),
    ...mapMutations('helper', ['setAlert']),
    setIdentifier({ isMobile, prefix }) {
      this.isMobile = isMobile;
      this.prefix = prefix;
    },
    async onGenerateOtp() {
      this.loadingOtp = true;
      this.otpGenerated = await this.generateOtp({
        identifier: this.isMobile
          ? `${this.prefix}${this.identifier}`
          : this.identifier,
      });
      if (this.otpGenerated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'OTP_SENT',
        });
        this.otpSent = true;
        const self = this;
        this.interval = setInterval(() => {
          self.resendTimer -= 1;
          if (self.resendTimer <= 0) {
            clearInterval(self.interval);
            self.otpSent = false;
            self.resendTimer = 30;
          }
        }, 1000);
      }
      this.loadingOtp = false;
    },
    async onLogin() {
      this.loading = true;
      const payload = {
        identifier: this.isMobile
          ? `${this.prefix}${this.identifier}`
          : this.identifier,
        otp: this.otp,
      };
      const authenticated = await this.authenticateWithOtp(payload);
      if (authenticated) {
        await this.getMySolutions();
        this.$emit('success');
      }
      this.loading = false;
    },
    onSubmit() {
      if (!this.otpGenerated) {
        this.onGenerateOtp();
      } else {
        this.onLogin();
      }
    },
  },
};
</script>
