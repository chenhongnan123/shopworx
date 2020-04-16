<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :starredPlans="true"
    :title="'Starred plans'"
  ></plan-widget>
</template>

<script>
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
};
</script>
