<template>
  <stats-widget
    :stat="stat"
    color="success"
    :title="'Running'"
    icon="mdi-progress-clock"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'InProgressStats',
  components: {
    StatsWidget,
  },
  created() {
    this.getInProgressPlans();
  },
  computed: {
    ...mapState('planning', ['inProgressPlans']),
    stat() {
      let count = 0;
      if (this.inProgressPlans) {
        count = Object.keys(this.inProgressPlans).length;
      }
      return count;
    },
  },
  methods: {
    ...mapActions('planning', ['getInProgressPlans']),
  },
};
</script>
