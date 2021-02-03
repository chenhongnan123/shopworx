<template>
  <stats-widget
    :title="$t('Completed')"
    color="accent"
    icon="mdi-progress-clock"
    :stat="completedOrdersCount"
  />
</template>

<script>
import { mapState } from 'vuex';
import StatsWidget from '../StatsWidget.vue';

export default {
  name: 'CompletedStats',
  components: {
    StatsWidget,
  },
  computed: {
    ...mapState('orderManagement', ['completedOrdersCount']),
  },
};
</script>
