<template>
  <auth-layout
    :illustration="resetPasswordIllustration"
    :title="'Reset password?'"
    :subTitle="'Enter your email or phone number'"
  >
    <validation-observer #default="{ passes }">
      <v-form @submit.prevent="passes(onResetPassword)">
        <v-card-text>
          <identifier-input
            :loading="loading"
            v-model="identifier"
            @on-update="setIdentifier"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            type="submit"
            color="primary"
            class="text-none"
            :loading="loading"
          >
            <v-icon left>mdi-lock-reset</v-icon>
            Reset password
          </v-btn>
        </v-card-actions>
        <v-card-text class="text-center py-0">
          <span>or</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="login"
            color="primary"
            class="text-none"
            :disabled="loading"
          >
            Login with password
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </auth-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import AuthLayout from '@/components/auth/AuthLayout.vue';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'ForgotPassword',
  components: {
    AuthLayout,
    IdentifierInput,
  },
  data() {
    return {
      prefix: '',
      identifier: '',
      loading: false,
      isMobile: false,
    };
  },
  computed: {
    resetPasswordIllustration() {
      return this.$vuetify.theme.dark
        ? 'forgot-password-dark'
        : 'forgot-password-light';
    },
  },
  methods: {
    ...mapMutations('auth', ['setAlert']),
    ...mapActions('auth', ['resetPassword']),
    login() {
      this.$router.push({ name: 'login' });
    },
    setIdentifier({ isMobile, prefix }) {
      this.isMobile = isMobile;
      this.prefix = prefix;
    },
    async onResetPassword() {
      this.loading = true;
      const success = await this.resetPassword({
        identifier: this.isMobile
          ? `${this.prefix}${this.identifier}`
          : this.identifier,
      });
      if (success) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PASSWORD_RESET',
        });
        this.$router.push({ name: 'login' });
      }
      this.loading = false;
    },
  },
};
</script>
