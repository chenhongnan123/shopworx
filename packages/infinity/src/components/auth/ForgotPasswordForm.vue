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
        >
          {{ $t('infinity.auth.forgotPassword.form.buttons.submit') }}
        </v-btn>
      </v-card-actions>
    </v-form>
    <v-btn
      text
      color="primary"
      :disabled="loading"
      class="text-none ml-4 pa-0"
      @click="$router.push({ name: 'login' })"
      v-text="$t('infinity.auth.forgotPassword.form.buttons.back')"
    ></v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ForgotPasswordForm',
  data() {
    return {
      identifier: null,
    };
  },
  computed: {
    ...mapState('auth', ['loading']),
  },
  methods: {
    ...mapActions('auth', ['resetPassword']),
    async forgotPassword() {
      const success = await this.resetPassword({
        identifier: this.identifier,
      });
      if (success) {
        this.$emit('success');
      }
    },
    onSubmit() {
      this.forgotPassword();
    },
  },
};
</script>
