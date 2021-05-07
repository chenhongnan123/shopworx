<template>
  <validation-observer #default="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onLogin)">
      <v-card-text>
        <identifier-input
          id="identifier_input"
          :loading="loading"
          v-model="identifier"
          @on-update="setIdentifier"
        />
        <validation-provider
          rules="required"
          name="password"
          #default="{ errors }"
        >
          <v-text-field
            id="password_input_shopworx"
            type="password"
            v-model="shopWorxPassword"
            :disabled="loading"
            :error-messages="errors"
            :label="$t('login.password')"
            autocomplete="current-password"
            prepend-icon="$password"
          ></v-text-field>
        </validation-provider>
        <div class="title text-center mt-4 mb-0">
          Operator details
        </div>
        <validation-provider rules="required" name="code" #default="{ errors }">
          <v-text-field
            id="code_input"
            v-model="code"
            :disabled="loading"
            hide-details="auto"
            :error-messages="errors"
            :label="$t('login.code')"
            autocomplete="username"
            prepend-icon="$identifier"
            class="mb-2"
          ></v-text-field>
        </validation-provider>
        <validation-provider rules="required" name="password" #default="{ errors }">
          <v-text-field
            id="password_input"
            type="password"
            v-model="password"
            :disabled="loading"
            hide-details="auto"
            :error-messages="errors"
            :label="$t('login.password')"
            autocomplete="current-password"
            prepend-icon="$password"
          ></v-text-field>
        </validation-provider>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          rounded
          id="login_btn"
          type="submit"
          color="primary"
          class="text-none"
          :loading="loading"
        >
          <v-icon left v-text="'$login'"></v-icon>
          {{ $t('login.login') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
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
      code: '',
      shopWorxPassword: '',
      identifier: '',
      loading: false,
      isMobile: false,
    };
  },
  methods: {
    ...mapActions('auth', ['authenticate', 'confirmOperator', 'loginOperator', 'getAuthCode']),
    ...mapActions('user', ['getMySolutions']),
    ...mapMutations('helper', ['setAlert']),
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
        password: this.shopWorxPassword,
      };
      const authenticated = await this.authenticate(payload);
      if (authenticated) {
        await this.getMySolutions();
        // this.$emit('success');
        const rst = await this.confirmOperator(
          `?query=operatorcode=="${this.code}"%26%26password=="${this.password}"`,
        );
        if (rst && rst.length) {
          const code = await this.getAuthCode(`?query=positionid=="${rst[0].positionid}"`);
          this.loginOperator({ ...rst[0], authcode: code });
          this.$emit('success');
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: this.$t('error.USER_NOT_FOUND'),
          });
        }
      }
      this.loading = false;
    },
  },
};
</script>
