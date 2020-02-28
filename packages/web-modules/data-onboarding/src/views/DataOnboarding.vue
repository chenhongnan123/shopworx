<template>
  <swx-fullscreen-layout>
    <template slot="navbarItems">
      <onboarding-account-menu />
    </template>
    <onboarding-index v-if="!loading" />
    <template v-else>
      Loading...
    </template>
  </swx-fullscreen-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SwxFullscreenLayout from '@shopworx/ui-components/core/SwxFullscreenLayout.vue';
import OnboardingAccountMenu from '../comopnents/OnboardingAccountMenu.vue';
import OnboardingIndex from '../comopnents/OnboardingIndex.vue';

export default {
  name: 'DataOnboarding',
  components: {
    SwxFullscreenLayout,
    OnboardingAccountMenu,
    OnboardingIndex,
  },
  data() {
    return {
      loading: null,
    };
  },
  computed: {
    ...mapGetters('user', ['isOnboardingComplete']),
  },
  async created() {
    if (this.isOnboardingComplete) {
      this.$router.replace({ name: 'home' });
    } else {
      this.loading = true;
      try {
        const me = await this.getMe();
        if (me && me.errors) {
          this.$root.$snackbar.error(me.errors);
        } else {
          const assets = await this.getAssets();
          if (assets && assets.errors) {
            this.$root.$snackbar.error(assets.errors);
          } else {
            const master = await this.getMasterElements();
            if (master && master.errors) {
              this.$root.$snackbar.error(master.errors);
            } else {
              const elements = await this.getElements();
              if (elements && elements.errors) {
                this.$root.$snackbar.error(elements.errors);
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    }
  },
  methods: {
    ...mapActions('user', ['getMe']),
    ...mapActions('onboarding', ['getAssets', 'getMasterElements', 'getElements']),
  },
};
</script>
