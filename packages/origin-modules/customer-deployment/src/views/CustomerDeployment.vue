<template>
  <div style="height:100%">
    <portal to="app-header">
      <span>Deployment</span>
      <v-btn icon small class="ml-4 mb-1">
        <v-icon
          v-text="'$info'"
        ></v-icon>
      </v-btn>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            small
            v-on="on"
            v-bind="attrs"
            class="ml-2 mb-1"
            @click="gotToSettings"
          >
            <v-icon
              v-text="'$settings'"
            ></v-icon>
          </v-btn>
        </template>
        Settings
      </v-tooltip>
    </portal>
    <deployment-service />
  </div>
</template>

<script>
import DeploymentService from '../components/DeploymentService.vue';

export default {
  name: 'CustomerDeployment',
  components: {
    DeploymentService,
  },
  methods: {
    gotToSettings() {
      this.$router.push({ name: 'deploymentSettings' });
    },
  },
};
</script>
