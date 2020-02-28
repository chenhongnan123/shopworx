<template>
  <div>
    <planning-filter />
    <planning-list-view
      :plans="plans"
      v-if="view === 0"
      :loading="loading"
    />
    <planning-calendar-view
      :plans="plans"
      v-else-if="view === 1"
      :loading="loading"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PlanningFilter from '@/components/planning/PlanningFilter.vue';
import PlanningListView from '@/components/planning/views/PlanningListView.vue';
import PlanningCalendarView from '@/components/planning/views/PlanningCalendarView.vue';

export default {
  name: 'Planning',
  components: {
    PlanningFilter,
    PlanningListView,
    PlanningCalendarView,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('planning', ['view', 'plans']),
  },
  async created() {
    this.loading = true;
    const data = await this.getPlans();
    if (data && data.errors) {
      this.$root.$snackbar.error(data.errors);
    }
    this.loading = false;
  },
  methods: {
    ...mapActions('planning', ['getPlans']),
  },
};
</script>
