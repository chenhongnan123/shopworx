<template>
  <v-btn
    color="primary"
    class="text-none"
    :class="spaceClass"
    small
    outlined
    :loading="installing"
    @click="installDebian"
  >
    Install debian
  </v-btn>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'InstallDebian',
  props: {
    nodebot: {
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
      installing: false,
    };
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('customerDeployment', ['createDeploymentOrder']),
    async installDebian() {
      this.installing = true;
      const orderPayload = {
        deploymentserviceid: this.nodebot.deploymentserviceid,
        masternodebotid: this.nodebot.id,
        operationname: 'upgrade-nodebot',
        status: 'Pending',
        assetid: 0,
      };
      const order = await this.createDeploymentOrder(orderPayload);
      this.installing = false;
      if (order) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'INSTALL_DEBIAN',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INSTALL_DEBIAN',
        });
      }
    },
  },
};
</script>
