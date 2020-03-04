<template>
  <div>
    <v-text-field
      outlined
      autofocus
      type="text"
      v-model="firstName"
      :label="$t('infinity.user.register.form.labels.firstName')"
    ></v-text-field>
    <v-text-field
      outlined
      type="text"
      v-model="lastName"
      :label="$t('infinity.user.register.form.labels.lastName')"
    ></v-text-field>
    <v-text-field
      outlined
      type="email"
      v-model="email"
      :label="$t('infinity.user.register.form.labels.email')"
    ></v-text-field>
    <v-text-field
      outlined
      type="tel"
      hide-details
      v-model="phoneNumber"
      :label="$t('infinity.user.register.form.labels.phoneNumber')"
    ></v-text-field>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'RegisterUserDetailsForm',
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
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
  methods: {
    ...mapActions('user', ['updateUser']),
    assignUser(user) {
      this.firstName = user.firstname;
      this.lastName = user.lastname;
      this.email = user.emailId;
      this.phoneNumber = user.phoneNumber;
    },
    async update() {
      const updated = await this.updateUser({
        firstname: this.firstName,
        lastname: this.lastName,
        emailId: this.email,
        phoneNumber: this.phoneNumber,
      });
      return updated;
    },
  },
};
</script>
