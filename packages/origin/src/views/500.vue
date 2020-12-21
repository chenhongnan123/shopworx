<template>
  <v-main>
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
              {{ $t('serverError.title') }}
            </div>
            <div class="display-1 my-12">
              {{ $t('serverError.subTitle1') }}
              <span class="primary--text font-weight-medium">
                {{ $t('serverError.subTitle2', { url: $route.fullPath }) }}
              </span>
              {{ $t('serverError.subTitle3') }}
            </div>
            <v-btn
              block
              rounded
              id="goBackHome"
              color="primary"
              class="text-none"
              @click="goToHome"
            >
              <v-icon
                left
                v-text="'$back'"
              ></v-icon>
              {{ $t('serverError.goHome') }}
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
  </v-main>
</template>

<script>
import AuthHeader from '@/components/auth/AuthHeader.vue';

export default {
  name: 'NotFound',
  components: {
    AuthHeader,
  },
  computed: {
    welcomeIllustration() {
      return this.$vuetify.theme.dark
        ? 'server-error-dark'
        : 'server-error-light';
    },
  },
  methods: {
    goToHome() {
      this.$router.replace({ path: '/' });
    },
  },
};
</script>
