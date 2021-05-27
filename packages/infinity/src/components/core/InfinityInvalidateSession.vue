<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-text>
        <v-row no-gutters class="pt-2">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${logoutIllustration}.svg`)"
            height="300"
            contain
          />
        </v-row>
        <v-row no-gutters class="mt-8">
          <v-col class="text-center title error--text">
            Oh no! Your session has expired.
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn
          block
          rounded
          color="primary"
          class="text-none"
          :loading="loading"
          @click="logout"
        >
          <v-icon left>mdi-logout</v-icon>
          Login again
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'InfinityInvalidateSession',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('helper', ['isSessionValid']),
    dialog: {
      get() {
        return !this.isSessionValid;
      },
      set(val) {
        this.setIsSessionValid(!val);
      },
    },
    logoutIllustration() {
      return this.$vuetify.theme.dark
        ? 'forbidden-dark'
        : 'forbidden-light';
    },
  },
  methods: {
    ...mapMutations('helper', ['setIsSessionValid']),
    ...mapActions('auth', ['logoutUser']),
    async logout() {
      this.loading = true;
      const success = await this.logoutUser();
      if (success) {
        this.$router.replace({
          name: 'login',
          query: { redirect: this.$route.fullPath },
        });
        this.setIsSessionValid(true);
      }
      this.loading = false;
    },
  },
  watch: {
    dialog(dialog) {
      const username = localStorage.getItem('username');
      const password = localStorage.getItem('password');
      if (dialog && username && password) {
        this.logout();
      }
    },
  },
};
</script>
