<template>
  <stats-widget
    :title="'Released'"
    icon="mdi-check-circle-outline"
    color="warning"
    :stat="pausedPlanCount"
  />
</template>

<script>
import { mapState } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'ReleasedStats',
  components: {
    StatsWidget,
  },
  computed: {
    ...mapState('orderManagement', ['pausedPlanCount']),
  },
};
</script>
