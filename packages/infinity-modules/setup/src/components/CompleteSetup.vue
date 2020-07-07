<template>
  <v-card flat class="transparent text-justify">
    <div class="headline mb-4">
      {{ $t('setup.complete.title1') }}
      <span class="primary--text font-weight-medium">
        {{ $t('setup.complete.title2') }}
      </span>
      {{ $t('setup.complete.title3') }}
    </div>
    <v-btn
      block
      rounded
      color="primary"
      class="text-none"
      @click="complete"
      :loading="loading"
      id="completeOboarding"
    >
      <v-icon
        left
        v-text="'$forward'"
      ></v-icon>
      {{ $t('setup.complete.next') }}
    </v-btn>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CompleteSetup',
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    ...mapActions('setup', ['completeOnboarding']),
    async complete() {
      this.loading = true;
      const success = await this.completeOnboarding();
      if (success) {
        localStorage.removeItem('step');
        this.$router.replace({ path: '/' });
      }
      this.loading = false;
    },
  },
};
</script>
