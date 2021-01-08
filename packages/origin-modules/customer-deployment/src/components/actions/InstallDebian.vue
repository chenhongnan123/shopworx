<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="primary"
        class="text-none"
        :class="spaceClass"
        :disabled="nodebot.isinstalled"
        :loading="installing"
        @click="installDebian"
      >
        <v-icon>mdi-download-outline</v-icon>
      </v-btn>
    </template>
    <span>Install debian</span>
  </v-tooltip>
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
        nodebotmasterid: this.nodebot.id,
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
