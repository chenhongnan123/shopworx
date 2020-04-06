<template>
  <v-card class="transparent" flat>
    <v-row no-gutters>
      <v-col cols="3" sm="2">
        <v-avatar
          size="96"
          color="secondary"
        >
          <v-icon
            x-large
            v-text="'$account'"
          ></v-icon>
        </v-avatar>
      </v-col>
      <v-col class="my-auto">
        <div class="display-1 font-weight-medium">
          {{ fullName }}
        </div>
        <div class="title">
          {{ customer }}, {{ currentSite }}
        </div>
      </v-col>
    </v-row>
    <validation-observer #default="{ passes }">
      <v-form @submit.prevent="passes(onUpdatePassword)">
        <v-card-text class="py-0">
          <validation-provider
            vid="password"
            name="Password"
            rules="required"
            #default="{ errors }"
          >
            <v-text-field
              type="password"
              id="newPassword"
              v-model="password"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="new-password"
              prepend-inner-icon="$password"
              :label="$t('user.password.newPassword')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required|confirmed:password"
            name="Password"
            #default="{ errors }"
          >
            <v-text-field
              type="password"
              :disabled="loading"
              id="confirmPassword"
              :error-messages="errors"
              v-model="confirmPassword"
              autocomplete="new-password"
              prepend-inner-icon="$password"
              :label="$t('user.password.confirmPassword')"
            ></v-text-field>
          </validation-provider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            type="submit"
            color="primary"
            class="text-none"
            id="updatePassword"
            :loading="loading"
          >
            <v-icon
              left
              v-text="'$password'"
            ></v-icon>
            {{ $t('user.password.update') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'UserPassword',
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
  },
  computed: {
    ...mapGetters('user', ['fullName', 'sites', 'currentSite', 'customer']),
    emailRules() {
      return this.phone ? 'email' : 'required|email';
    },
    phoneRules() {
      return this.email ? 'digits:10' : 'required|digits:10';
    },
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    ...mapMutations('helper', ['setAlert']),
    async onUpdatePassword() {
      this.loading = true;
      const payload = {
        newpassword: this.password,
      };
      const updated = await this.updatePassword(payload);
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'UPDATED',
        });
        this.password = '';
        this.confirmPassword = '';
      }
      this.loading = false;
    },
  },
};
</script>
