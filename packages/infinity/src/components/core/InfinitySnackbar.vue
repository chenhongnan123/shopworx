<template>
  <v-snackbar
    v-model="snackbar"
    :color="type"
    bottom
    right
    id="app_snackbar"
    :timeout="timeout"
  >
    <div
      id="app_msg"
      v-text="msg"
      v-for="(msg, n) in message"
      :key="n"
    ></div>
    <template #action="{ attrs }">
      <v-btn
        text
        v-bind="attrs"
        id="app_msg_close"
        class="text-none"
        @click="snackbar = false"
        v-text="$t('snackbar.close')"
      ></v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'InfinitySnackbar',
  data() {
    return {
      timeout: 6000,
    };
  },
  computed: {
    ...mapState('helper', ['alert']),
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
      const msg = [];
      if (this.type) {
        let { message } = this.alert;
        if (typeof message === 'string') {
          message = [message];
        }
        message.forEach((m) => {
          if (this.type && this.type.toUpperCase().trim() === 'SUCCESS') {
            msg.push(this.$t(`success.${m}`));
          } else if (this.type && this.type.toUpperCase().trim() === 'ERROR') {
            msg.push(this.$t(`error.${m}`));
          }
        });
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
          this.cancel();
        }
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    cancel() {
      this.setAlert({
        show: false,
        type: null,
        message: null,
      });
      this.snackbar = false;
    },
  },
};
</script>
