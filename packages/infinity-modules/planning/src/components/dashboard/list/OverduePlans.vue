<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :title="'Plans running late'"
  ></plan-widget>
</template>

<script>
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'OverduePlans',
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
