<template>
  <v-card height="450">
    <v-card-title>
      Monitored instances
    </v-card-title>
    <v-card-text>
      {{ selectedDevice }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'MonitoredInstances',
  computed: {
    ...mapState('customerDeployment', ['selectedDevice']),
  },
};
</script>
