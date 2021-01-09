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
    loginIllustration() {
      return this.$vuetify.theme.dark
        ? 'login-dark'
        : 'login-light';
    },
  },
  methods: {
    onSuccess() {
      this.$router.replace(this.$route.query.redirect || { path: '/' });
    },
  },
};
</script>
