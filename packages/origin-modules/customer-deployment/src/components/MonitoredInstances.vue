<template>
  <v-card>
    <v-card-title class="pb-0">
      Monitored instances
    </v-card-title>
    <v-divider></v-divider>
    <perfect-scrollbar>
      <v-card-text class="pb-0" style="height:408px">
        {{ selectedDevice }}
      </v-card-text>
    </perfect-scrollbar>
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
