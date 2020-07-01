<template>
  <plan-widget
    :error="error"
    :loading="loading"
    :starredPlans="true"
    :title="'Starred plans'"
    :groupedPlans="starredPlans"
    @refresh-widget="fetchPlans"
  ></plan-widget>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PlanWidget from '../PlanWidget.vue';

export default {
  name: 'StarredPlans',
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
    ...mapState('planning', ['starredPlans']),
  },
  methods: {
    ...mapActions('planning', ['getStarredPlans']),
    async fetchPlans() {
      this.loading = true;
      await this.getStarredPlans();
      this.loading = false;
    },
  },
};
</script>
