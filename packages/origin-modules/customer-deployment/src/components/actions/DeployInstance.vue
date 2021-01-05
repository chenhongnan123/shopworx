<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        :disabled="!selectedDevice.ispasswordless || !instance.nodebot.isinstalled"
        v-bind="attrs"
        color="success"
        :loading="deploying"
        @click="deployInstance"
      >
        <v-icon>mdi-rocket-launch-outline</v-icon>
      </v-btn>
    </template>
    <span>Deploy instance</span>
  </v-tooltip>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'DeployInstance',
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deploying: false,
    };
  },
  computed: {
    ...mapState('customerDeployment', [
      'selectedService',
      'selectedDevice',
    ]),
  },
  methods: {
    ...mapActions('customerDeployment', ['createDeploymentOrder']),
    async deployInstance() {
      if (await this.$root.$confirm.open(
        'Deploy instance',
        `Please confirm the deployment for "${this.instance.name}".
        You cannot stop the deployment once it is started.`,
      )) {
        this.deploying = true;
        const payload = {
          deploymentserviceid: this.selectedService.id,
          lineid: this.selectedDevice.id,
          nodebotmasterid: this.instance.nodebot.id,
          instanceid: this.instance.id,
          operationname: 'deploy-instance',
          status: 'Pending',
          assetid: 0,
        };
        await this.createDeploymentOrder(payload);
        this.deploying = false;
      }
    },
  },
};
</script>
