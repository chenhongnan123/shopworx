<template>
  <v-card>
    {{ planDetails }}
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PlanInfo',
  computed: {
    ...mapState('planning', ['planDetails']),
  },
};
</script>
