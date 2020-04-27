<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :starredPlans="true"
    :title="'Starred plans'"
    @refresh-widget="fetchPlans"
  ></plan-widget>
</template>

<script>
import { mapActions } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'StarredPlans',
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
    async fetchPlans() {
      this.loading = true;
      this.plans = await this.getPlanningRecords('?query=starred==true');
      if (!this.plans) {
        this.error = true;
      }
      this.loading = false;
    },
  },
};
</script>
