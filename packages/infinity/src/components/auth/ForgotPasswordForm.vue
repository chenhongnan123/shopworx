<template>
  <div>
    <v-form @submit.prevent="onSubmit">
      <v-card-text>
        <v-text-field
          outlined
          autofocus
          type="text"
          v-model="identifier"
          autocomplete="username"
          :label="$t('infinity.auth.forgotPassword.form.labels.identifier')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn
          type="submit"
          block
          color="primary"
          :loading="loading"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          v-text="$t('infinity.auth.forgotPassword.form.buttons.submit')"
        ></v-btn>
      </v-card-actions>
    </v-form>
    <v-btn
      text
      color="primary"
      class="text-none ml-4 pa-0"
      @click="$router.push({ name: 'login' })"
      v-text="$t('infinity.auth.forgotPassword.form.buttons.back')"
    ></v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'ForgotPasswordForm',
  data() {
    return {
      error: null,
      loading: false,
      identifier: null,
    };
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    async forgotPassword() {
      this.loading = true;
      try {
        const data = await this.resetPassword({
          identifier: this.identifier,
        });
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          this.$emit('success', true);
        }
      } catch (e) {
        console.error(e.message);
      }
      this.loading = false;
    },
    onSubmit() {
      this.forgotPassword();
    },
  },
};
</script>
