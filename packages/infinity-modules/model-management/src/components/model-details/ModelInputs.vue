<template>
  <v-card flat>
    <v-card-text class="pt-0">
      <v-autocomplete
          v-model="parameterList"
          :items="inputParameters"
          filled
          class="ma-0 pa-0"
          chips
          color="primary"
          label="Select"
          item-text="name"
          item-value="parameterId"
          hide-details
          multiple
        >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            color="primary"
            close
            @click="data.select"
            @click:close="remove(data.item)"
          >
            {{ data.item.name }}
          </v-chip>
          </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item"></v-list-item-content>
              </template>
              <template v-else>
                <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
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
    parameterList: {
      get() {
        return this.modelInputs;
      },
      set(val) {
        this.saveInputParam(val);
      },
    },
  },
  methods: {
    ...mapActions('modelManagement', [
      'createInputParameter',
      'deleteInputParameter',
    ]),
    async remove(param) {
      const modelInputId = this.modelInputs
        .find((input) => input.parameterId === param.parameterId)
        .id;
      const deleted = await this.deleteInputParameter(modelInputId);
      if (deleted) {
        const index = this.parameterList.findIndex((f) => f.parameterId === param.parameterId);
        if (index >= 0) this.parameterList.splice(index, 1);
      }
    },
    async saveInputParam(param) {
      console.log(param);
      const object = param[param.length - 1];
      await this.createInputParameter({
        modelId: this.model.id,
        parameterId: object,
      });
    },
    async updateInputParameter(param) {
      if (param.selected) {
        await this.createInputParameter({
          modelId: this.model.id,
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
