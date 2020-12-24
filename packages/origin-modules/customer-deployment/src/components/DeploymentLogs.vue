<template>
  <v-card outlined>
    <v-card-title>
      Logs
    </v-card-title>
    <v-card-text>
      {{ selectedDevice }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DeploymentLogs',
  computed: {
    ...mapState('customerDeployment', ['selectedDevice']),
  },
};
</script>
