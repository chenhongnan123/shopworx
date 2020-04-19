<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :addPlan="true"
    :loading="loading"
    :title="'Plans yet to start'"
    @refresh-widget="fetchPlans"
  ></plan-widget>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'NotStartedPlans',
  components: {
    PlanWidget,
  },
  data() {
    return {
      plans: [],
      error: false,
      loading: false,
    };
  },
  created() {
    this.fetchPlans();
  },
  methods: {
    ...mapActions('planning', ['getPlanningRecords']),
    ...mapMutations('planning', ['setNotStartedPlanCount']),
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getPlanningRecords('?query=status=="notStarted"');
      if (!this.plans) {
        this.error = true;
      } else {
        this.setNotStartedPlanCount(this.plans.length);
      }
      this.loading = false;
    },
  },
};
</script>
