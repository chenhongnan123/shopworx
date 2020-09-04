<template>
  <plan-widget
    :groupedPlans="overduePlans"
    :error="error"
    :loading="loading"
    :title="'Plans running late'"
    @refresh-widget="fetchPlans"
  ></plan-widget>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'OverduePlans',
  components: {
    PlanWidget,
  },
  data() {
    return {
      plans: {},
      error: false,
      loading: false,
    };
  },
  created() {
    this.fetchPlans();
  },
  computed: {
    ...mapState('planning', ['overduePlans']),
  },
  methods: {
    ...mapActions('planning', ['getOverduePlans']),
    async fetchPlans() {
      this.loading = true;
      await this.getOverduePlans();
      this.loading = false;
    },
  },
};
</script>
