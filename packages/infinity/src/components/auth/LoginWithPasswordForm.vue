<template>
  <div>
    <v-form @submit.prevent="onSubmit">
      <v-card-text>
        <v-text-field
          outlined
          autofocus
          type="email"
          v-model="identifier"
          autocomplete="username"
          :label="$t('infinity.auth.login.passwordForm.labels.identifier')"
        ></v-text-field>
        <v-text-field
          outlined
          hide-details
          type="password"
          :label="$t('infinity.auth.login.passwordForm.labels.password')"
          v-model="password"
          autocomplete="current-password"
        ></v-text-field>
        <p class="text-right body-2 mt-1">
          <span
            @click="optLogin"
            style="cursor: pointer;"
            v-text="$t('infinity.auth.login.passwordForm.loginWithOtp')"
          ></span>
        </p>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          type="submit"
          block
          color="primary"
          :loading="loading"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          v-text="$t('infinity.auth.login.passwordForm.buttons.login')"
        ></v-btn>
      </v-card-actions>
    </v-form>
    <v-btn
      text
      color="primary"
      class="text-none ml-4 pa-0"
      @click="$router.push({ name: 'forgot-password' })"
      v-text="$t('infinity.auth.login.passwordForm.buttons.forgotPassword')"
    >
      Forgot Password?
    </v-btn>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'LoginWithPasswordForm',
  data() {
    return {
      error: null,
      loading: null,
      password: null,
      identifier: null,
    };
  },
  methods: {
    ...mapActions('auth', ['loginWithPassword']),
    ...mapMutations('auth', ['setLoginWithOtp']),
    optLogin() {
      this.setLoginWithOtp(true);
    },
    async login() {
      this.loading = true;
      try {
        const data = await this.loginWithPassword({
          identifier: this.identifier,
          password: this.password,
        });
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          this.$emit('success', true);
        }
      } catch (e) {
        console.error(e.message);
      }
      this.loading = null;
    },
    onSubmit() {
      this.login();
    },
  },
};
</script>
