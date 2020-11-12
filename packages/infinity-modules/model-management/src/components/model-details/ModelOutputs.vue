<template>
  <v-card flat>
    <v-card-text>
      <v-checkbox
        hide-details
        class="ma-0 pa-0"
        :key="outputTransformation.id"
        :label="outputTransformation.name"
        v-model="outputTransformation.selected"
        @change="updateOutputTransformation(outputTransformation)"
        v-for="outputTransformation in mappedOutputTransforamtions"
      ></v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ModelOutputs',
  props: {
    modelDetails: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('modelManagement', ['outputTransformations']),
    modelOutputs() {
      return this.modelDetails && this.modelDetails.modelOutputs;
    },
    mappedOutputTransforamtions() {
      return this.outputTransformations
        .map((trans) => ({
          ...trans,
          loading: false,
          selected: this.modelOutputs
            .map((input) => input.transformationId)
            .includes(trans.id),
        }));
    },
  },
  methods: {
    ...mapActions('modelManagement', [
      'createOutputTransformation',
      'deleteOutputTransformation',
    ]),
    async updateOutputTransformation(trans) {
      if (trans.selected) {
        await this.createOutputTransformation({
          // eslint-disable-next-line
          modelId: this.model._id,
          transformationId: trans.id,
        });
      } else {
        const modelOutputId = this.modelOutputs
          .find((input) => input.transformationId === trans.id)
          .id;
        this.deleteOutputTransformation(modelOutputId);
      }
    },
  },
};
</script>
