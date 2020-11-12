<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        v-bind="attrs"
        color="success"
        @click="deployModel"
      >
        <v-icon>mdi-rocket-outline</v-icon>
      </v-btn>
    </template>
    <span>Deploy model</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'DeployModel',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async deployModel() {
      if (await this.$root.$confirm.open(
        'Deploy model',
        `Please confirm the deployment for "${this.model.modelname}".
        You cannot stop the deployment in the middle once it is started.`,
      )) {
        /* await Promise.all([
          this.plans.forEach((plan) => {
            // eslint-disable-next-line
            this.deletePlan(plan._id);
          }),
        ]); */
        this.$emit('on-deploy');
      }
    },
  },
};
</script>
