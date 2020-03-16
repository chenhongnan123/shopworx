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
      await this.initOnboarding();
      this.loading = false;
    }
  },
  methods: {
    ...mapActions('onboarding', ['initOnboarding']),
  },
};
</script>
