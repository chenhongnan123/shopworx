<template>
  <swx-fullscreen-layout>
    <v-card flat class="transparent">
      <p
        class="text-center primary--text display-2 font-weight-medium"
        v-text="$t('infinity.auth.login.title')"
      ></p>
      <p
        class="text-center title font-weight-regular"
        v-text="$t('infinity.auth.login.subTitle')"
      ></p>
      <v-row>
        <v-col
          md="6"
          cols="12"
          class="text-center"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <v-img
            :src="require(`@shopworx/assets/svgs/${loginSvg}.svg`)"
            contain
            height="330"
          >
          </v-img>
        </v-col>
        <v-col
          md="6"
          cols="12"
        >
          <v-fade-transition mode="out-in">
            <login-with-password-form
              v-if="!loginWithOtp"
              @success="success"
            />
            <login-with-otp-form
              v-else
              @success="success"
            />
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-card>
  </swx-fullscreen-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SwxFullscreenLayout from '@shopworx/ui-components/core/SwxFullscreenLayout.vue';
import LoginWithPasswordForm from '@/components/auth/LoginWithPasswordForm.vue';
import LoginWithOtpForm from '@/components/auth/LoginWithOtpForm.vue';

export default {
  name: 'Login',
  metaInfo() {
    return {
      title: 'Login',
    };
  },
  components: {
    SwxFullscreenLayout,
    LoginWithPasswordForm,
    LoginWithOtpForm,
  },
  computed: {
    ...mapState('auth', ['loginWithOtp']),
    loginSvg() {
      return this.$vuetify.theme.dark
        ? 'login-dark'
        : 'login-light';
    },
  },
  methods: {
    ...mapActions('user', ['getMe']),
    async success() {
      try {
        const data = await this.getMe();
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          this.$router.replace(this.$route.query.redirect || { name: 'home' });
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
