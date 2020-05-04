<template>
  <plan-widget
    :error="error"
    :addPlan="true"
    :loading="loading"
    @refresh-widget="fetchPlans"
    :title="'Plans yet to start'"
    :groupedPlans="notStartedPlans"
  ></plan-widget>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'NotStartedPlans',
  components: {
    PlanWidget,
  },
  data() {
    return {
      error: false,
      loading: false,
    };
  },
  created() {
    this.fetchPlans();
  },
  computed: {
    ...mapState('planning', ['notStartedPlans']),
  },
  methods: {
    ...mapActions('planning', ['getNotStartedPlans']),
    async fetchPlans() {
      this.loading = true;
      await this.getNotStartedPlans();
      this.loading = false;
    },
  },
};
</script>
