<template>
  <v-card flat class="transparent text-justify">
    <template v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
      <span>
        Fetching production log app settings from ShopWorx servers
      </span>
    </template>
    <template v-else-if="error">
      We couldn't fetch production log app settings from ShopWorx servers.
      Please
      <a
        @click="fetchMaster"
        class="primary--text font-weight-medium"
      >
        retry.
      </a>
    </template>
    <template v-else>
      <div class="headline mb-4">
        {{ $t('production.setup.complete.title1') }}
        <span class="primary--text font-weight-medium">
          {{ $t('production.setup.complete.title2') }}
        </span>
        {{ $t('production.setup.complete.title3') }}
      </div>
      <v-btn
        block
        rounded
        color="primary"
        class="text-none"
        @click="complete"
        :loading="creating"
        id="completeOboarding"
      >
        <v-icon
          left
          v-text="'$forward'"
        ></v-icon>
        {{ $t('production.setup.complete.next') }}
      </v-btn>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'CompleteOnboarding',
  data() {
    return {
      window: 0,
      error: false,
      loading: false,
      creating: false,
      tagsToProvision: [],
    };
  },
  async created() {
    this.loading = true;
    await this.getElementOnboardingState();
    const success = await this.getMasterElements();
    this.error = !success;
    this.loading = false;
  },
  methods: {
    ...mapMutations('productionLog', ['setElementOnboarded', 'setDataOnboarded']),
    ...mapActions('productionLog', ['getMasterElements', 'getElementOnboardingState', 'createElements']),
    async complete() {
      this.creating = true;
      const success = await this.createElements();
      if (success) {
        this.setDataOnboarded(false);
        this.setElementOnboarded(false);
        localStorage.removeItem('productionStep');
        this.setDataOnboarded(true);
        this.setElementOnboarded(true);
      }
      this.creating = false;
    },
  },
};
</script>
