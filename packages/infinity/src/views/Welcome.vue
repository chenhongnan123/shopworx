<template>
  <v-content>
    <auth-header />
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" md="6" lg="5" xl="4" class="text-center">
          <v-card flat class="transparent">
            <div class="display-2">
              Welcome! We have been expecting you.
            </div>
            <div class="display-1 my-12">
              First things first, let's start by
              <span class="primary--text font-weight-medium">
                creating your account.
              </span>
              It will take less than a minute.
            </div>
            <v-btn
              block
              color="primary"
              class="text-none"
              @click="createAccount"
            >
              <v-icon left>mdi-skip-next-circle-outline</v-icon>
              Let's get started
            </v-btn>
          </v-card>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${welcomeIllustration}.svg`)"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import AuthHeader from '@/components/auth/AuthHeader.vue';

export default {
  name: 'Welcome',
  components: {
    AuthHeader,
  },
  computed: {
    welcomeIllustration() {
      return this.$vuetify.theme.dark
        ? 'welcome-dark'
        : 'welcome-light';
    },
  },
  methods: {
    createAccount() {
      this.$router.push({ name: 'register' });
    },
  },
};
</script>
