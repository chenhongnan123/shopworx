<template>
  <stats-widget
    :title="'Paused'"
    icon="mdi-progress-alert"
    color="warning"
    stat="0"
  />
</template>

<script>
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'PausedStats',
  components: {
    StatsWidget,
  },
};
</script>
