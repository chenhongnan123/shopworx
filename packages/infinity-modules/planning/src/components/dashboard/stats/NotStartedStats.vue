<template>
  <stats-widget
    :title="'Not started'"
    icon="mdi-progress-wrench"
    color="info"
    stat="0"
  />
</template>

<script>
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'NotStartedStats',
  components: {
    StatsWidget,
  },
};
</script>
