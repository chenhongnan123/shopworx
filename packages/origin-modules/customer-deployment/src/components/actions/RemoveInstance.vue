<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
        :disabled="instance.isdeploying"
        :loading="removing"
        @click="removeInstance"
      >
        <v-icon>mdi-minus-circle-outline</v-icon>
      </v-btn>
    </template>
    <span>Remove instance</span>
  </v-tooltip>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'RemoveInstance',
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      removing: false,
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
    async removeInstance() {
      if (await this.$root.$confirm.open(
        'Remove instance',
        `Please confirm that you want to remove "${this.instance.name}".
        You cannot stop the action once it is started.`,
      )) {
        this.removing = true;
        const payload = {
          deploymentserviceid: this.selectedService.id,
          deploymentservicename: this.selectedService.name,
          lineid: this.selectedDevice.id,
          linename: this.selectedDevice.name,
          nodebotmasterid: this.instance.nodebot.id,
          nodebotmastername: this.instance.nodebot.name,
          instanceid: this.instance.id,
          instancename: this.instance.name,
          operationname: 'delete-instance',
          status: 'Pending',
          assetid: 0,
        };
        await this.createDeploymentOrder(payload);
        this.mapInstances();
        this.removing = false;
      }
    },
  },
};
</script>
