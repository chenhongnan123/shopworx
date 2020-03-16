<template>
  <div>
    <v-form @submit.prevent="onSubmit">
      <v-card-text>
        <v-text-field
          type="tel"
          outlined
          autofocus
          hide-details
          :label="$t('infinity.auth.login.otpForm.labels.phoneNumber')"
          v-model="phoneNumber"
          autocomplete="username"
        ></v-text-field>
        <p
          v-if="!otpSent"
          class="text-right body-2 mt-1"
        >
          <span
            @click="passwordLogin"
            style="cursor: pointer;"
            v-text="$t('infinity.auth.login.otpForm.loginWithPassword')"
          ></span>
        </p>
        <p
          v-else
          class="text-right body-2 mt-1"
        >
          <span
            v-if="!otpGenerated"
            @click="sendOtp"
            style="cursor: pointer;"
            v-text="$t('infinity.auth.login.otpForm.resendOtp')"
          ></span>
          <span
            v-else
            v-text="$t('infinity.auth.login.otpForm.resendOtpIn', { time: resendTimer })"
          ></span>
        </p>
        <div v-if="otpSent">
          <v-text-field
            outlined
            :label="$t('infinity.auth.login.otpForm.labels.otp')"
            type="number"
            v-model="otp"
            hide-details
          ></v-text-field>
          <p class="text-right body-2 mt-1">
            <span
              @click="passwordLogin"
              style="cursor: pointer;"
              v-text="$t('infinity.auth.login.otpForm.loginWithPassword')"
            ></span>
          </p>
        </div>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          type="submit"
          block
          color="primary"
          :loading="loading"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        >
          <span>
            {{ !otpSent
              ? $t('infinity.auth.login.otpForm.buttons.sendOtp')
              : $t('infinity.auth.login.otpForm.buttons.login')
            }}
          </span>
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'LoginWithOtpForm',
  data() {
    return {
      phoneNumber: null,
      otp: null,
      otpGenerated: false,
      interval: null,
      resendTimer: 30,
    };
  },
  computed: {
    ...mapState('auth', ['loading', 'otpSent']),
  },
  methods: {
    ...mapActions('auth', ['generateOtp', 'loginWithOtp']),
    ...mapMutations('auth', ['setLoginWithOtp']),
    passwordLogin() {
      this.setLoginWithOtp(null);
    },
    async sendOtp() {
      this.otpGenerated = await this.generateOtp({
        phoneNumber: this.phoneNumber,
      });
      if (this.otpGenerated) {
        const self = this;
        this.interval = setInterval(() => {
          self.resendTimer -= 1;
          if (self.resendTimer <= 0) {
            clearInterval(self.interval);
            self.otpGenerated = false;
            self.resendTimer = 30;
          }
        }, 1000);
      }
    },
    async login() {
      const success = await this.loginWithOtp({
        phoneNumber: this.phoneNumber,
        otp: this.otp,
      });
      if (success) {
        this.$emit('success');
      }
    },
    onSubmit() {
      if (!this.otpSent) {
        this.sendOtp();
      } else {
        this.login();
      }
    },
  },
};
</script>
