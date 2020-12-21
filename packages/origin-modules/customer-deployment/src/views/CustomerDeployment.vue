<template>
  <v-container fluid>
    <portal to="app-header">
      Deployment
    </portal>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CustomerDeployment',
  computed: {
    ...mapState('user', ['me']),
  },
  watch: {
    me(val) {
      console.log(val);
    },
  },
};
</script>
