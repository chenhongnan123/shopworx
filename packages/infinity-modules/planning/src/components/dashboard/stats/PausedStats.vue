<template>
  <stats-widget
    :stat="stat"
    color="warning"
    :title="'Paused'"
    icon="mdi-progress-alert"
  />
</template>

<script>
import { mapState, mapActions } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'PausedStats',
  components: {
    StatsWidget,
  },
  created() {
    this.getPausedPlans();
  },
  computed: {
    ...mapState('planning', ['pausedPlans']),
    stat() {
      let count = 0;
      if (this.pausedPlans) {
        count = Object.keys(this.pausedPlans).length;
      }
      return count;
    },
  },
  methods: {
    ...mapActions('planning', ['getPausedPlans']),
  },
};
</script>
