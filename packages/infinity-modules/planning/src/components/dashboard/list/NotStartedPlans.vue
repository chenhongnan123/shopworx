<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :addPlan="true"
    :loading="loading"
    :title="'Plans yet to start'"
  ></plan-widget>
</template>

<script>
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
};
</script>
