<template>
  <v-snackbar
    v-model="snackbar"
    :color="type"
    bottom
    right
    :timeout="timeout"
  >
    <span v-text="message"></span>
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
    ></v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'SwxSnackbar',
  data() {
    return {
      timeout: 6000,
      reLogin: null,
      logoutTimer: 5,
      logoutInterval: null,
    };
  },
  computed: {
    alert() {
      return this.$store.state.helper.alert;
    },
    snackbar: {
      get() {
        return this.alert ? this.alert.show : null;
      },
      set(val) {
        this.setAlert({
          ...this.alert,
          show: val,
        });
      },
    },
    type() {
      return this.alert ? this.alert.type : null;
    },
    message() {
      let msg = null;
      if (this.type) {
        const { message } = this.alert;
        if (this.type.toUpperCase().trim() === 'SUCCESS') {
          msg = this.$t(`infinity.success.${message}`);
        } else if (this.type.toUpperCase().trim() === 'ERROR') {
          msg = this.$t(`infinity.error.${message}`);
        }
      }
      return msg;
    },
  },
  watch: {
    type(val) {
      if (val.toUpperCase().trim() === 'ERROR') {
        const { message } = this.alert;
        if (message === 'INVALID_SESSION') {
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
      }
    },
  },
  methods: {
    setAlert(alert) {
      this.$store.commit('helper/setAlert', alert);
    },
    cancel() {
      this.snackbar = false;
    },
    async logout() {
      const success = await this.$store.dispatch('auth/logoutUser');
      if (success) {
        this.cancel();
        clearInterval(this.logoutInterval);
        this.$router.replace({
          name: 'login',
          query: { redirect: this.$route.fullPath },
        });
      }
    },
  },
};
</script>
