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
              @success="onSuccess"
              v-else-if="!isPasswordUpdated"
            />
            <v-card
              flat
              v-else
              class="transparent"
            >
              <div class="display-1 mb-4 font-weight-medium text-center primary--text">
                {{ $t('register.updated') }}
              </div>
              <v-btn
                block
                id="next"
                color="primary"
                class="text-none"
                @click="onSuccess"
              >
                <v-icon
                  left
                  v-text="'$next'"
                ></v-icon>
                {{ $t('helper.next') }}
              </v-btn>
            </v-card>
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
import { mapGetters, mapActions } from 'vuex';
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
  async created() {
    if (!this.me) {
      await this.getMe();
    }
  },
  computed: {
    ...mapGetters('user', ['isAccountUpdated', 'isPasswordUpdated', 'isOnboardingComplete']),
    registerIllustration() {
      return this.$vuetify.theme.dark
        ? 'register-dark'
        : 'register-light';
    },
  },
  methods: {
    ...mapActions('user', ['getMe']),
    onSuccess() {
      if (!this.isOnboardingComplete) {
        this.$router.replace({ name: 'setup' });
      } else {
        this.$router.replace({ path: '/' });
      }
    },
  },
};
</script>
