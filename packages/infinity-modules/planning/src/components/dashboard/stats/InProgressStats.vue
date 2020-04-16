<template>
  <stats-widget
    :title="'Running'"
    color="success"
    icon="mdi-progress-clock"
    stat="0"
  />
</template>

<script>
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'InProgressStats',
  components: {
    StatsWidget,
  },
};
</script>
