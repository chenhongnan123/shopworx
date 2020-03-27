<template>
  <validation-observer #default="{ passes }">
    <v-form @submit.prevent="passes(onSubmit)">
      <v-card-text>
        <identifier-input
          :loading="loading || loadingOtp"
          v-model="identifier"
          @on-update="setIdentifier"
        />
        <validation-provider
          name="OTP"
          v-if="otpGenerated"
          rules="required|max:4"
          #default="{ errors }"
        >
          <v-text-field
            label="OTP"
            type="number"
            v-model="otp"
            :disabled="loading"
            hide-details="auto"
            :error-messages="errors"
            prepend-inner-icon="mdi-lock-outline"
          ></v-text-field>
        </validation-provider>
        <p
          v-if="otpGenerated"
          class="text-right ma-0 pa-0 px-1"
        >
          <v-btn
            text
            small
            color="primary"
            v-if="!otpSent"
            :disabled="loading"
            :loading="loadingOtp"
            @click="onGenerateOtp"
            class="text-none pa-0"
          >
            Resend otp?
          </v-btn>
          <v-btn
            text
            small
            v-else
            disabled
            color="primary"
            class="text-none pa-0"
          >
            Resend otp in {{ resendTimer }}
          </v-btn>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          v-if="!otpGenerated"
          type="submit"
          color="primary"
          class="text-none"
          :loading="loadingOtp"
        >
          <v-icon left>mdi-send-outline</v-icon>
          Send OTP
        </v-btn>
        <v-btn
          block
          v-else
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
        >
          <v-icon left>mdi-shield-check-outline</v-icon>
          Login securely
        </v-btn>
      </v-card-actions>
      <v-card-text class="text-center py-0">
        <span>or</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          class="text-none"
          :disabled="loading"
          @click="$emit('login-with-password')"
        >
          Login with password
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
    };
  },
  methods: {
    ...mapActions('auth', ['generateOtp', 'authenticateWithOtp']),
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
