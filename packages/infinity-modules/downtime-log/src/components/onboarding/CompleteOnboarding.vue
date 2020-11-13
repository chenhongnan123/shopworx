<template>
  <v-card flat class="transparent text-justify">
    <template v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
      <span>
        Fetching downtime log app settings from ShopWorx servers
      </span>
    </template>
    <template v-else-if="error">
      We couldn't fetch downtime log app settings from ShopWorx servers.
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
        {{ $t('downtime.setup.complete.title1') }}
        <span class="primary--text font-weight-medium">
          {{ $t('downtime.setup.complete.title2') }}
        </span>
        {{ $t('downtime.setup.complete.title3') }}
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
        {{ $t('downtime.setup.complete.next') }}
      </v-btn>
    </template>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';

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
  methods: {
    ...mapMutations('downtimeLog', ['setOnboarded']),
    complete() {
      this.creating = true;
      localStorage.removeItem('downtimeStep');
      this.setOnboarded(true);
      this.creating = false;
    },
  },
};
</script>
