<template>
  <v-snackbar
    v-model="snackbar"
    :color="type"
    bottom
    right
    id="app_snackbar"
    :timeout="timeout"
  >
    <span
      id="app_msg"
      v-text="message"
    ></span>
    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        id="app_msg_close"
        v-if="!reLogin"
        class="text-none"
        @click="snackbar = false"
        v-text="$t('snackbar.close')"
      ></v-btn>
      <v-btn
        text
        v-else
        v-bind="attrs"
        id="app_relogin"
        class="text-none"
        @click="logout"
        v-text="$t('snackbar.redirectToLogin', { time: logoutTimer })"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'InfinitySnackbar',
  data() {
    return {
      timeout: 6000,
      reLogin: null,
      logoutTimer: 5,
      logoutInterval: null,
      snackbarTimeout: null,
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
        if (this.type && this.type.toUpperCase().trim() === 'SUCCESS') {
          msg = this.$t(`success.${message}`);
        } else if (this.type && this.type.toUpperCase().trim() === 'ERROR') {
          msg = this.$t(`error.${message}`);
        }
      }
      return msg;
    },
  },
  watch: {
    snackbar(val) {
      if (!val) {
        this.setAlert({
          show: false,
          type: null,
          message: null,
        });
      }
    },
    type(val) {
      if (val && val.toUpperCase().trim() === 'ERROR') {
        const { message } = this.alert;
        if (message === 'INVALID_SESSION') {
          this.reLogin = true;
          const self = this;
          this.logoutInterval = setInterval(() => {
            self.logoutTimer -= 1;
          }, 1000);
          this.snackbarTimeout = setTimeout(async () => {
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
      this.setAlert({
        show: false,
        type: null,
        message: null,
      });
      this.snackbar = false;
    },
    async logout() {
      const success = await this.$store.dispatch('auth/logoutUser');
      if (success) {
        clearTimeout(this.snackbarTimeout);
        clearInterval(this.logoutInterval);
        this.cancel();
        this.$router.replace({
          name: 'login',
          query: { redirect: this.$route.fullPath },
        });
      }
    },
  },
};
</script>
