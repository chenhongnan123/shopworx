<template>
  <v-snackbar
    v-model="snackbar"
    :color="type"
    bottom
    right
    :timeout="timeout"
  >
    <span v-text="text"></span>
    <v-btn
      text
      v-if="!reLogin"
      class="text-none"
      @click="snackbar = false"
      v-text="$t('infinity.snackbar.buttons.close')"
    ></v-btn>
    <v-btn
      text
      v-else
      class="text-none"
      @click="logout"
      v-text="$t('infinity.snackbar.buttons.redirectToLogin', { time: logoutTimer })"
    >
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SwxSnackbar',
  data() {
    return {
      reLogin: null,
      snackbar: null,
      timeout: 0,
      type: null,
      text: null,
      logoutTimer: 5,
      logoutInterval: null,
    };
  },
  methods: {
    ...mapActions('auth', ['logoutUser']),
    success(successObj) {
      this.snackbar = true;
      this.type = 'success';
      this.text = this.$t(`infinity.success.${successObj.successCode}`) || successObj.successMessage;
    },
    error(errorObj) {
      this.snackbar = true;
      this.type = 'error';
      this.text = this.$t(`infinity.error.${errorObj.errorCode}`) || errorObj.errorMessage;
      if (errorObj.errorCode === 'INVALID_SESSION') {
        this.reLogin = true;
        const self = this;
        this.logoutInterval = setInterval(async () => {
          self.logoutTimer -= 1;
        }, 1000);
        setTimeout(async () => {
          await self.logout();
        }, this.logoutTimer * 1000);
      } else {
        this.reLogin = null;
        this.timeout = 6000;
      }
    },
    cancel() {
      this.snackbar = null;
    },
    async logout() {
      try {
        const data = await this.logoutUser();
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          this.cancel();
          clearInterval(this.logoutInterval);
          this.$router.replace({
            name: 'login',
            query: { redirect: this.$route.fullPath },
          });
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>
