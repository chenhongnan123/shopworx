<template>
  <v-content>
    <auth-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" md="6" lg="5" xl="4">
          <v-fade-transition mode="out-in">
            <update-account v-if="!isAccountUpdated" />
            <update-password
              v-else
              @success="onSuccess"
            />
          </v-fade-transition>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${registerIllustration}.svg`)"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import { mapGetters } from 'vuex';
import AuthHeader from '@/components/auth/AuthHeader.vue';
import UpdateAccount from '@/components/user/UpdateAccount.vue';
import UpdatePassword from '@/components/user/UpdatePassword.vue';

export default {
  name: 'Register',
  components: {
    AuthHeader,
    UpdateAccount,
    UpdatePassword,
  },
  computed: {
    ...mapGetters('user', ['isAccountUpdated']),
    registerIllustration() {
      return this.$vuetify.theme.dark
        ? 'register-dark'
        : 'register-light';
    },
  },
  methods: {
    onSuccess() {
      this.$router.replace({ name: 'onboarding' });
    },
  },
};
</script>
