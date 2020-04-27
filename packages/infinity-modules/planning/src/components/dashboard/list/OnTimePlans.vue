<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :title="'Plans running on time'"
    @refresh-widget="fetchPlans"
  ></plan-widget>
</template>

<script>
import { mapActions } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'OnTimePlans',
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
      this.plans = await this.getPlanningRecords(
        '?query=status=="inProgress"%7C%7Cstatus=="paused"%26%26starred==false',
      );
      if (!this.plans) {
        this.error = true;
      }
      this.loading = false;
    },
  },
};
</script>
