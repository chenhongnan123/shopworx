<template>
  <auth-layout
    :title="$t('login.title')"
    :subTitle="$t('login.subTitle')"
    :illustration="loginIllustration"
  >
    <v-fade-transition mode="out-in">
      <login-with-password
        @success="onSuccess"
        v-if="loginWithPassword"
        @login-with-otp="loginWithPassword = false"
      />
      <login-with-otp
        v-else
        @success="onSuccess"
        @login-with-password="loginWithPassword = true"
      />
    </v-fade-transition>
  </auth-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthLayout from '@/components/layout/AuthLayout.vue';
import LoginWithOtp from '@/components/auth/LoginWithOtp.vue';
import LoginWithPassword from '@/components/auth/LoginWithPassword.vue';

export default {
  name: 'Login',
  components: {
    AuthLayout,
    LoginWithOtp,
    LoginWithPassword,
  },
  data() {
    return {
      loginWithPassword: true,
    };
  },
  computed: {
    ...mapGetters('user', ['isAccountUpdated', 'isPasswordUpdated', 'isOnboardingComplete']),
    loginIllustration() {
      return this.$vuetify.theme.dark
        ? 'login-dark'
        : 'login-light';
    },
  },
  methods: {
    onSuccess() {
      if (!this.isAccountUpdated) {
        this.$router.replace({ name: 'welcome' });
      } else if (!this.isPasswordUpdated) {
        this.$router.replace({ name: 'register' });
      } else if (!this.isOnboardingComplete) {
        this.$router.replace({ name: 'setup' });
      } else {
        this.$router.replace(this.$route.query.redirect || { path: '/' });
      }
    },
  },
};
</script>
