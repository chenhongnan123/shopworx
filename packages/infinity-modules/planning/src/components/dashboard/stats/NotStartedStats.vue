<template>
  <stats-widget
    :stat="stat"
    color="info"
    :title="'Not started'"
    icon="mdi-progress-wrench"
  />
</template>

<script>
import { mapState } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'NotStartedStats',
  components: {
    StatsWidget,
  },
  computed: {
    ...mapState('planning', ['notStartedPlans']),
    stat() {
      let count = 0;
      if (this.notStartedPlans) {
        count = Object.keys(this.notStartedPlans).length;
      }
      return count;
    },
  },
};
</script>
