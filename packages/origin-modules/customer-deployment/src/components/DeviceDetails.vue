<template>
  <v-card outlined>
    <v-card-title>
      Device details
      <v-btn
        text
        small
        color="primary"
        class="text-none ml-2 mb-1"
      >
        <v-icon left small>mdi-pencil-outline</v-icon>
        Edit
      </v-btn>
    </v-card-title>
    <v-card-text>
      {{ selectedDevice }}
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DeviceDetails',
  computed: {
    ...mapState('customerDeployment', ['selectedDevice']),
  },
};
</script>
