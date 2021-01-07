<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        :disabled="!selectedDevice.ispasswordless
          || !instance.nodebot.isinstalled
          || instance.isdeploying"
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
import { mapActions, mapState, mapMutations } from 'vuex';

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
      'mappedDevices',
    ]),
  },
  methods: {
    ...mapMutations('customerDeployment', ['setReactiveMappedDevice', 'setSelectedDevice']),
    ...mapActions('customerDeployment', ['createDeploymentOrder']),
    mapInstances() {
      // update instance in selected device
      this.setSelectedDevice({
        ...this.selectedDevice,
        instances: this.selectedDevice.instances.map((instance) => {
          let isdeploying = false;
          if (this.instance.id === instance.id) {
            isdeploying = true;
          }
          return {
            ...instance,
            isdeploying,
          };
        }),
      });
      // update instance list in mapped device
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (this.selectedDevice.id === this.mappedDevices[i].id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances: this.mappedDevices[i].instances.map((instance) => {
                let isdeploying = false;
                if (this.instance.id === instance.id) {
                  isdeploying = true;
                }
                return {
                  ...instance,
                  isdeploying,
                };
              }),
            },
          });
        }
      }
    },
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
        this.mapInstances();
        this.deploying = false;
      }
    },
  },
};
</script>
