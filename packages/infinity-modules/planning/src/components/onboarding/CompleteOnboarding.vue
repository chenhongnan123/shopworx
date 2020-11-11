<template>
  <v-card flat class="transparent text-justify">
    <template v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
      <span>
        Fetching planning app settings from ShopWorx servers
      </span>
    </template>
    <template v-else-if="error">
      We couldn't fetch plan settings from ShopWorx servers.
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
        {{ $t('planning.setup.complete.title1') }}
        <span class="primary--text font-weight-medium">
          {{ $t('planning.setup.complete.title2') }}
        </span>
        {{ $t('planning.setup.complete.title3') }}
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
        {{ $t('planning.setup.complete.next') }}
      </v-btn>
    </template>
  </v-card>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

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
  computed: {
    ...mapState('planning', ['planningMaster']),
  },
  created() {
    if (!this.planningMaster) {
      this.fetchMaster();
    }
  },
  methods: {
    ...mapMutations('planning', ['setOnboarded']),
    ...mapActions('planning', [
      'getPlanningMaster',
      'createPlanningElement',
      'getPlanningElement',
    ]),
    async fetchMaster() {
      this.loading = true;
      const success = await this.getPlanningMaster();
      this.error = !success;
      this.loading = false;
    },
    async complete() {
      this.creating = true;
      const success = await this.createPlanningElement();
      if (success) {
        const element = await this.getPlanningElement();
        if (element) {
          localStorage.removeItem('planStep');
          this.setOnboarded(true);
        }
      }
      this.creating = false;
    },
  },
};
</script>
