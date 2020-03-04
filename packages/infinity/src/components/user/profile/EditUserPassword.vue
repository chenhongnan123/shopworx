<template>
  <v-form @submit.prevent="update">
    <v-card flat>
      <v-card-text>
        <v-text-field
          outlined
          type="password"
          autocomplete="off"
          v-model="currentPassword"
          :label="$t('infinity.userProfile.profile.labels.password')"
        ></v-text-field>
        <v-text-field
          outlined
          type="password"
          autocomplete="off"
          v-model="newPassword"
          :label="$t('infinity.userProfile.profile.labels.newPassword')"
        ></v-text-field>
        <v-text-field
          outlined
          type="password"
          autocomplete="off"
          v-model="confirmPassword"
          :label="$t('infinity.userProfile.profile.labels.confirmNewPassword')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          type="submit"
          :loading="loading"
          class="text-none primary ml-2"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          v-text="$t('infinity.userProfile.profile.buttons.updatePassword')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'EditUserPassword',
  data() {
    return {
      loading: null,
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    };
  },
  methods: {
    ...mapActions('user', ['updatePassword']),
    async update() {
      this.loading = true;
      const updated = await this.updatePassword({
        currentpassword: this.currentPassword,
        newpassword: this.newPassword,
      });
      if (updated) {
        this.currentPassword = null;
        this.newPassword = null;
        this.confirmPassword = null;
      }
      this.loading = null;
    },
  },
};
</script>
