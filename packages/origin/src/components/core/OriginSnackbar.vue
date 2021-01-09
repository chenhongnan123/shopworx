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
  name: 'OriginSnackbar',
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
      let msg = null;
      if (this.type) {
        const { message, options = {} } = this.alert;
        if (this.type && this.type.toUpperCase().trim() === 'SUCCESS') {
          msg = this.$t(`success.${message}`, options);
        } else if (this.type && this.type.toUpperCase().trim() === 'ERROR') {
          msg = this.$t(`error.${message}`, options);
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
