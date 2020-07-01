<template>
  <plan-widget
    :error="error"
    :loading="loading"
    :groupedPlans="onTimePlans"
    @refresh-widget="fetchPlans"
    :title="'Plans running on time'"
  ></plan-widget>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'OnTimePlans',
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
    ...mapState('planning', ['onTimePlans']),
  },
  methods: {
    ...mapActions('planning', ['getOnTimePlans']),
    async fetchPlans() {
      this.loading = true;
      await this.getOnTimePlans();
      this.loading = false;
    },
  },
};
</script>
