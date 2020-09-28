<template>
  <div style="height: 100%" class="px-4">
    <plan-loading v-if="loading" />
    <plan-not-found v-else-if="!loading && !planDetails" />
    <v-row v-else>
      <v-col cols="12" md="6">
        <plan-info />
      </v-col>
      <v-col cols="12" md="6">
        <plan-insights />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import PlanInfo from '../components/details/PlanInfo.vue';
import PlanInsights from '../components/details/PlanInsights.vue';
import PlanLoading from '../components/details/PlanLoading.vue';
import PlanNotFound from '../components/details/PlanNotFound.vue';

export default {
  name: 'PlanDetails',
  components: {
    PlanInfo,
    PlanInsights,
    PlanLoading,
    PlanNotFound,
  },
  data() {
    return {
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    await this.getPlanDetails(this.id);
    this.setExtendedHeader(false);
    this.loading = false;
  },
  watch: {
    planDetails(val) {
      if (val) {
        this.setExtendedHeader(false);
      }
    },
  },
  computed: {
    ...mapState('planning', ['planDetails']),
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    ...mapActions('planning', ['getPlanDetails']),
  },
};
</script>
