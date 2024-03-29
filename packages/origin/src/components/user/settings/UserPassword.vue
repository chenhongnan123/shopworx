<template>
  <v-card class="transparent" flat>
    <user-avatar />
    <validation-observer ref="form" #default="{ handleSubmit }">
      <v-form @submit.prevent="handleSubmit(onUpdatePassword)">
        <v-card-text class="py-0 pt-2">
          <validation-provider
            vid="updatePassword"
            name="password"
            rules="required"
            #default="{ errors }"
          >
            <v-text-field
              filled
              type="password"
              id="newPassword"
              v-model="password"
              :disabled="loading"
              :error-messages="errors"
              autocomplete="new-password"
              prepend-icon="$password"
              :label="$t('user.password.newPassword')"
            ></v-text-field>
          </validation-provider>
          <validation-provider
            rules="required|confirmed:updatePassword"
            name="password"
            #default="{ errors }"
          >
            <v-text-field
              filled
              class="ml-8"
              type="password"
              :disabled="loading"
              id="confirmPassword"
              :error-messages="errors"
              v-model="confirmPassword"
              autocomplete="new-password"
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
import { mapActions, mapMutations } from 'vuex';
import UserAvatar from '@/components/user/settings/UserAvatar.vue';

export default {
  name: 'UserPassword',
  components: {
    UserAvatar,
  },
  data() {
    return {
      password: '',
      loading: false,
      confirmPassword: '',
    };
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
        requestAnimationFrame(() => {
          this.$refs.form.reset();
        });
      }
      this.loading = false;
    },
  },
};
</script>
