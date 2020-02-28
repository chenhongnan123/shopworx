<template>
  <swx-fullscreen-layout>
    <v-card flat class="transparent">
      <p
        class="text-center primary--text display-2 font-weight-medium"
        v-text="$t('infinity.auth.forgotPassword.title')"
      ></p>
      <p
        class="text-center title font-weight-regular"
        v-text="$t('infinity.auth.forgotPassword.subTitle')"
      ></p>
      <v-row>
        <v-col
          md="6"
          cols="12"
          class="text-center"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <v-img
            :src="require(`@shopworx/assets/svgs/${forgotPasswordSvg}.svg`)"
            contain
            height="330"
          >
          </v-img>
        </v-col>
        <v-col
          md="6"
          cols="12"
        >
          <forgot-password-form @success="success" />
        </v-col>
      </v-row>
    </v-card>
  </swx-fullscreen-layout>
</template>

<script>
import SwxFullscreenLayout from '@shopworx/ui-components/core/SwxFullscreenLayout.vue';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';

export default {
  name: 'ForgotPassword',
  metaInfo() {
    return {
      title: 'Forgot Password',
    };
  },
  components: {
    SwxFullscreenLayout,
    ForgotPasswordForm,
  },
  computed: {
    forgotPasswordSvg() {
      return this.$vuetify.theme.dark
        ? 'forgot-password-dark'
        : 'forgot-password-light';
    },
  },
  methods: {
    success() {
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>
