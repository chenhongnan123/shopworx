<template>
  <validation-observer #default="{ invalid, validated, passes }">
    <v-form @submit.prevent="passes(onLogin)">
      <v-card-text>
        <identifier-input
          :loading="loading"
          v-model="identifier"
          @on-update="setIdentifier"
        />
        <validation-provider
          rules="required"
          name="Password"
          #default="{ errors }"
        >
          <v-text-field
            type="password"
            label="Password"
            v-model="password"
            :disabled="loading"
            hide-details="auto"
            :error-messages="errors"
            prepend-inner-icon="mdi-lock-outline"
          ></v-text-field>
        </validation-provider>
        <p class="text-right ma-0 pa-0 px-1">
          <v-btn
            text
            small
            color="primary"
            :disabled="loading"
            @click="resetPassword"
            class="text-none pa-0"
          >
            Forgot password?
          </v-btn>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
          :disabled="invalid || !validated"
        >
          <v-icon left>mdi-shield-check-outline</v-icon>
          Login securely
        </v-btn>
      </v-card-actions>
      <v-card-text class="text-center py-0">
        <span>or</span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          class="text-none"
          :disabled="loading"
          @click="$emit('login-with-otp')"
        >
          Login with otp
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex';
import IdentifierInput from '@/components/auth/IdentifierInput.vue';

export default {
  name: 'LoginWithPassword',
  components: {
    IdentifierInput,
  },
  data() {
    return {
      prefix: '',
      password: '',
      identifier: '',
      loading: false,
      isMobile: false,
    };
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    resetPassword() {
      this.$router.push({ name: 'forgot-password' });
    },
    setIdentifier({ isMobile, prefix }) {
      this.isMobile = isMobile;
      this.prefix = prefix;
    },
    async onLogin() {
      this.loading = true;
      const payload = {
        identifier: this.isMobile
          ? `${this.prefix}${this.identifier}`
          : this.identifier,
        password: this.password,
      };
      const authenticated = await this.authenticate(payload);
      if (authenticated) {
        this.$emit('success');
      }
      this.loading = false;
    },
  },
};
</script>
