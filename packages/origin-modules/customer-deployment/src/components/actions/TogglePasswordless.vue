<template>
  <v-btn
    color="primary"
    class="text-none"
    :class="spaceClass"
    small
    outlined
    :loading="deploying"
    @click="enablePasswordless"
  >
    Enable passwordless
  </v-btn>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'TogglePasswordless',
  props: {
    device: {
      type: Object,
      required: true,
    },
    spaceClass: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      deploying: false,
    };
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('customerDeployment', ['createDeploymentOrder']),
    async enablePasswordless() {
      this.deploying = true;
      const orderPayload = {
        deploymentserviceid: this.device.deploymentserviceid,
        lineid: this.device.id,
        operationname: 'enable-passwordless',
        status: 'Pending',
        assetid: 0,
      };
      const order = await this.createDeploymentOrder(orderPayload);
      this.deploying = false;
      if (order) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PASSWORDLESS',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PASSWORDLESS',
        });
      }
    },
  },
};
</script>
