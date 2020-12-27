<template>
  <div style="height:100%">
    <v-container fluid>
      <portal to="app-header">
        <v-btn class="mb-1" icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span>Deployment updates</span>
      </portal>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
      >
        <v-col cols="12" align="center">
          <v-img
            :src="require(`@shopworx/assets/illustrations/${illustration}.svg`)"
            id="construction_illustration"
            height="400"
            contain
          />
        </v-col>
        <v-col cols="12" align="center">
          <div class="title">
            Coming soon!
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'DeploymentUpdates',
  created() {
    this.setExtendedHeader(false);
  },
  computed: {
    illustration() {
      return this.$vuetify.theme.dark
        ? 'coming-soon-dark'
        : 'coming-soon-light';
    },
  },
  methods: {
    ...mapMutations('helper', ['setExtendedHeader']),
    goBack() {
      this.$router.push({ name: 'customerDeployment' });
    },
  },
};
</script>
