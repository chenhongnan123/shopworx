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
              {{ $t('welcome.title') }}
            </div>
            <div class="display-1 my-12">
              {{ $t('welcome.subTitle1') }}
              <span class="primary--text font-weight-medium">
                {{ $t('welcome.subTitle2') }}
              </span>
              {{ $t('welcome.subTitle3') }}
            </div>
            <v-btn
              block
              rounded
              id="start"
              color="primary"
              class="text-none"
              @click="createAccount"
            >
              <v-icon
                left
                v-text="'$skip'"
              ></v-icon>
              {{ $t('welcome.start') }}
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
import { mapGetters } from 'vuex';
import AuthHeader from '@/components/auth/AuthHeader.vue';

export default {
  name: 'Welcome',
  components: {
    AuthHeader,
  },
  computed: {
    ...mapGetters('user', ['isPasswordUpdated', 'isOnboardingComplete']),
    welcomeIllustration() {
      return this.$vuetify.theme.dark
        ? 'welcome-dark'
        : 'welcome-light';
    },
  },
  methods: {
    createAccount() {
      if (!this.isPasswordUpdated) {
        this.$router.replace({ name: 'register' });
      } else if (!this.isOnboardingComplete) {
        this.$router.replace({ name: 'setup' });
      } else {
        this.$router.replace({ path: '/' });
      }
    },
  },
};
</script>
