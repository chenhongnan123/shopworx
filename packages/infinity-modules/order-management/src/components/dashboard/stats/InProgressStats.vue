<template>
  <stats-widget
    :title="'Running'"
    color="success"
    icon="mdi-progress-clock"
    :stat="onTimePlanCount"
  />
</template>

<script>
import { mapState } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'InProgressStats',
  components: {
    StatsWidget,
  },
  computed: {
    ...mapState('orderManagement', ['onTimePlanCount']),
  },
};
</script>
