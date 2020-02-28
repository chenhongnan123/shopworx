<template>
  <v-text-field
    outlined
    autofocus
    type="text"
    :loading="fetch"
    v-model="username"
    autocomplete="username"
    :error="!isValid && username !== '' && username !== null"
    :label="$t('infinity.user.register.form.labels.username')"
  >
    <template
      #append
      v-if="!fetch"
    >
      <v-icon
        v-if="isValid"
        color="success"
        v-text="'$success'"
      ></v-icon>
      <v-icon
        v-else
        color="error"
        v-text="'$alert'"
      ></v-icon>
    </template>
  </v-text-field>
</template>

<script>
import Debounce from 'lodash.debounce';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'RegisterUsernameForm',
  data() {
    return {
      fetch: null,
      isValid: null,
      username: null,
      isValidUsername: null,
    };
  },
  computed: {
    ...mapState('user', ['me']),
  },
  created() {
    if (this.me && this.me.user) {
      this.username = this.me.user.username;
    }
    this.isValidUsername = Debounce(this.getUsername, 500);
  },
  watch: {
    username(val) {
      if (val) {
        this.isValidUsername();
      }
    },
  },
  methods: {
    ...mapActions('user', ['updateUser', 'isUsernameAvailable']),
    async getUsername() {
      this.fetch = true;
      this.isValid = null;
      try {
        const data = await this.isUsernameAvailable({
          username: this.username,
        });
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else if (data.results) {
          this.isValid = true;
        } else {
          this.isValid = false;
        }
      } catch (e) {
        console.error(e);
      }
      this.fetch = false;
    },
    async update() {
      try {
        const data = await this.updateUser({
          username: this.username,
        });
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
          return false;
        }
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
  },
};
</script>
