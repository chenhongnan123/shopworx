<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="error"
        :disabled="instance.isdeploying"
        :loading="deleting"
        @click="terminateInstance"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </template>
    <span>Terminate instance</span>
  </v-tooltip>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'TerminateInstance',
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleting: false,
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
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('customerDeployment', ['setReactiveMappedDevice', 'setSelectedDevice']),
    ...mapActions('customerDeployment', ['deleteInstance']),
    mapInstances() {
      // update instance in selected device
      this.setSelectedDevice({
        ...this.selectedDevice,
        instances: this.selectedDevice.instances
          .filter((instance) => this.instance.id !== instance.id),
      });
      // update instance list in mapped device
      for (let i = 0; i < this.mappedDevices.length; i += 1) {
        if (this.selectedDevice.id === this.mappedDevices[i].id) {
          this.setReactiveMappedDevice({
            index: i,
            payload: {
              ...this.mappedDevices[i],
              instances: this.mappedDevices[i].instances
                .filter((instance) => this.instance.id !== instance.id),
            },
          });
        }
      }
    },
    async terminateInstance() {
      if (await this.$root.$confirm.open(
        'Terminate instance',
        `Please confirm that you want to terminate "${this.instance.name}".
        Instance will be deleted forever.`,
      )) {
        this.deleting = true;
        // eslint-disable-next-line
        const deleted = await this.deleteInstance(this.instance._id);
        if (deleted) {
          this.mapInstances();
          this.setAlert({
            show: true,
            type: 'success',
            message: 'INSTANCE_DELETED',
            options: {
              instance: this.instance.id,
            },
          });
        }
        this.deleting = false;
      }
    },
  },
};
</script>
