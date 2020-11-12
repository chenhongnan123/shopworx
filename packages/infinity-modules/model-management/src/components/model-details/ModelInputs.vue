<template>
  <v-card flat>
    <v-card-title>
      <v-text-field
        dense
        outlined
        single-line
        hide-details
        v-model="search"
        autocomplete="off"
        label="Filter inputs"
        append-icon="mdi-magnify"
      ></v-text-field>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-checkbox
        hide-details
        class="ma-0 pa-0"
        :key="inputParameter.id"
        v-model="inputParameter.selected"
        :label="inputParameter.description"
        @change="updateInputParameter(inputParameter)"
        v-for="inputParameter in filteredInputParameters"
      ></v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ModelInputs',
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
  data() {
    return {
      search: '',
    };
  },
  computed: {
    ...mapState('modelManagement', ['inputParameters']),
    modelInputs() {
      return this.modelDetails && this.modelDetails.modelInputs;
    },
    filteredInputParameters() {
      return this.inputParameters
        .filter((param) => param.description
          .trim()
          .toUpperCase()
          .includes(this.search.trim().toUpperCase()))
        .map((param) => ({
          ...param,
          loading: false,
          selected: this.modelInputs
            .map((input) => input.parameterId)
            .includes(param.id),
        }));
    },
  },
  methods: {
    ...mapActions('modelManagement', [
      'createInputParameter',
      'deleteInputParameter',
    ]),
    async updateInputParameter(param) {
      if (param.selected) {
        await this.createInputParameter({
          // eslint-disable-next-line
          modelId: this.model._id,
          parameterId: param.id,
        });
      } else {
        const modelInputId = this.modelInputs
          .find((input) => input.parameterId === param.id)
          .id;
        this.deleteInputParameter(modelInputId);
      }
    },
  },
};
</script>
