<template>
  <auth-layout
    :title="$t('forgotPassword.title')"
    :illustration="resetPasswordIllustration"
    :subTitle="$t('forgotPassword.subTitle')"
  >
    <validation-observer #default="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(onResetPassword)">
        <v-card-text>
          <identifier-input
            id="identifier_input"
            :loading="loading"
            v-model="identifier"
            @on-update="setIdentifier"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            rounded
            type="submit"
            color="primary"
            class="text-none"
            id="reset_password_btn"
            :loading="loading"
          >
            <v-icon
              left
              v-text="'$passwordReset'"
            ></v-icon>
            {{ $t('forgotPassword.reset') }}
          </v-btn>
        </v-card-actions>
        <v-card-text class="text-center py-0">
          <span>{{ $t('helper.or') }}</span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="login"
            color="primary"
            class="text-none"
            :disabled="loading"
            id="login_password_btn"
          >
            {{ $t('login.loginWithPassword') }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </auth-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import AuthLayout from '@/components/layout/AuthLayout.vue';
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
    ...mapMutations('helper', ['setAlert']),
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
