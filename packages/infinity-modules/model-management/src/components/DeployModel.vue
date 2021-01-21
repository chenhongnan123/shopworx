<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="success"
        :small="small"
        :class="spaceClass"
        :loading="deploying"
        :disabled="!model.modelUpdateStatus"
        @click="deployModel"
      >
        <v-icon>mdi-rocket-launch-outline</v-icon>
      </v-btn>
    </template>
    <span>Deploy model</span>
  </v-tooltip>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeployModel',
  props: {
    model: {
      type: Object,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
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
    ...mapActions('modelManagement', ['createNewDeploymentOrder']),
    async deployModel() {
      if (await this.$root.$confirm.open(
        'Deploy model',
        `Please confirm the deployment for "${this.model.name}".
        You cannot stop the deployment once it is started.`,
      )) {
        this.deploying = true;
        await this.createNewDeploymentOrder(this.model.id);
        this.deploying = false;
      }
    },
  },
};
</script>
