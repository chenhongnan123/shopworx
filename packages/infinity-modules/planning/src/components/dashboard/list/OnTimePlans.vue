<template>
  <plan-widget
    :plans="plans"
    :error="error"
    :loading="loading"
    :title="'Plans running on time'"
  ></plan-widget>
</template>

<script>
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
};
</script>
