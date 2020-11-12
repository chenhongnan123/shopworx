<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-on="on"
        color="error"
        v-bind="attrs"
        @click="deleteModel"
      >
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </template>
    <span>Delete model</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'DeleteModel',
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async deleteModel() {
      if (await this.$root.$confirm.open(
        'Delete model',
        `Are you sure want to delete "${this.model.modelname}"?
        This will also delete the associated model files.`,
      )) {
        /* await Promise.all([
          this.plans.forEach((plan) => {
            // eslint-disable-next-line
            this.deletePlan(plan._id);
          }),
        ]); */
        this.$emit('on-delete');
      }
    },
  },
};
</script>
