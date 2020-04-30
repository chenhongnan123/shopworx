<template>
  <stats-widget
    :title="'Not started'"
    icon="mdi-progress-wrench"
    color="info"
    :stat="notStartedPlanCount"
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
    ...mapState('planning', ['notStartedPlanCount']),
  },
};
</script>
