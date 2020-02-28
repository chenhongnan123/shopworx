<template>
  <v-form @submit.prevent="update">
    <v-card flat>
      <v-card-text>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              outlined
              type="text"
              v-model="firstName"
              :label="$t('infinity.userProfile.profile.labels.firstName')"
            ></v-text-field>
          </v-col>
          <v-col class="ml-4">
            <v-text-field
              outlined
              type="text"
              v-model="lastName"
              :label="$t('infinity.userProfile.profile.labels.lastName')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              outlined
              type="email"
              v-model="email"
              :label="$t('infinity.userProfile.profile.labels.email')"
            ></v-text-field>
          </v-col>
          <v-col class="ml-4">
            <v-text-field
              outlined
              type="tel"
              v-model="phoneNumber"
              :label="$t('infinity.userProfile.profile.labels.phoneNumber')"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          disabled
          outlined
          type="text"
          v-model="username"
          :label="$t('infinity.userProfile.profile.labels.username')"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          type="submit"
          :loading="loading"
          class="text-none primary ml-2"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          v-text="$t('infinity.userProfile.profile.buttons.updateUser')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'EditUserProfile.profile',
  data() {
    return {
      loading: null,
      email: null,
      lastName: null,
      username: null,
      firstName: null,
      phoneNumber: null,
    };
  },
  computed: {
    ...mapState('user', ['me']),
  },
  created() {
    if (this.me && this.me.user) {
      this.assignUser(this.me.user);
    }
  },
  watch: {
    me(val) {
      if (val && val.user) {
        this.assignUser(val.user);
      }
    },
  },
  methods: {
    ...mapActions('user', ['getMe', 'updateUser']),
    assignUser(user) {
      this.firstName = user.firstname;
      this.lastName = user.lastname;
      this.email = user.emailId;
      this.phoneNumber = user.phoneNumber;
      this.username = user.username;
    },
    async update() {
      this.loading = true;
      try {
        const data = await this.updateUser({
          firstname: this.firstName,
          lastname: this.lastName,
          emailId: this.email,
          phoneNumber: this.phoneNumber,
          username: this.username,
        });
        if (data && data.errors) {
          this.$root.$snackbar.error(data.errors);
        } else {
          const resp = await this.getMe();
          if (resp && resp.errors) {
            this.$root.$snackbar.error(resp.errors);
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.loading = null;
    },
  },
};
</script>
