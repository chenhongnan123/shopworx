<template>
  <v-card flat class="transparent text-justify">
    <div class="headline mb-4">
      Hurray! Welcome to ShopWorx. We have successfully
      <span class="primary--text font-weight-medium">
        onboarded
      </span>
      you.
    </div>
    <v-btn
      block
      color="primary"
      class="text-none"
      @click="complete"
      :loading="loading"
    >
      <v-icon left>mdi-chevron-triple-right</v-icon>
      Let's go
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
        this.$router.replace({ name: 'home' });
      }
      this.loading = false;
    },
  },
};
</script>
