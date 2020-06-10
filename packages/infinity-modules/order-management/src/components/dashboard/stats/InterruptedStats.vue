<template>
  <stats-widget
    :title="'Interrupted'"
    color="error"
    icon="mdi-progress-clock"
    :stat="interruptedOrderCount"
  />
</template>

<script>
import { mapState } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'InterruptedStats',
  components: {
    StatsWidget,
  },
  computed: {
    ...mapState('orderManagement', ['interruptedOrderCount']),
  },
};
</script>
