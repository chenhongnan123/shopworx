<template>
  <v-card flat>
    <v-card-text class="pt-0">
      <v-autocomplete
          v-model="realElement"
          :items="elementList"
          filled
          class="ma-0 pa-0"
          chips
          color="primary"
          label="Select element"
          item-text="elementName"
          return-object
          hide-details
          @change="onElementSelect"
          @input="searchInput=null"
          :search-input.sync="searchInput"
        >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            color="primary"
          >
            {{ data.item.elementName }}
          </v-chip>
          </template>
            <template v-slot:item="data">
              <template v-if="isObjectType(data.item)">
                <v-list-item-content v-text="data.item"></v-list-item-content>
              </template>
              <template v-else>
                <v-list-item-content>
                <v-list-item-title v-html="data.item.elementName"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
      <div class="caption">*Required field</div>
      <v-autocomplete
          v-model="parameterList"
          :items="inputParametersList"
          filled
          class="ma-0 pa-0"
          chips
          color="primary"
          label="Select"
          item-text="name"
          item-value="parameterId"
          hide-details
          multiple
          menu-props="closeOnContentClick"
          @change="onChange()"
          @input="searchInput=null"
          :search-input.sync="searchInput"
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
              <template v-if="isObjectType(data.item)">
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
      <div class="caption">*Required field</div>
      <span>Please add timestamp and mainid as default parameters</span>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

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
      inputParametersList: [],
      searchInput: null,
      realElement: null,
      elementList: [],
    };
  },
  created() {
    this.elementList.push({
      header: 'Real ELement',
    });
    const object = {
      elementName: `process_${this.selectedSubstation}`,
    };
    this.elementList.push(object);
    const firstVal = object.elementName;
    if (firstVal.length > 0) {
      this.realElement = firstVal;
      this.onElementSelect();
    }
  },
  computed: {
    ...mapState('modelManagement', ['inputParameters', 'selectedSubstation']),
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
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement', [
      'createInputParameter',
      'deleteInputParameter',
      'fetchModelDetails',
    ]),
    isObjectType(item) {
      return typeof item !== 'object';
    },
    onElementSelect() {
      this.inputParametersList = this.inputParameters;
    },
    onChange() {
      // this.parameterList = this.modelInputs;
    },
    async remove(param) {
      const dataMainid = this.parameterList.find((f) => f.parameterId === param.parameterId);
      if (dataMainid.tagName === 'mainid'
         || dataMainid.tagName === 'timestamp'
         || dataMainid.tagName === 'productionstatus') {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NOT_DELETE_MAINID',
        });
      } else {
        const modelInputId = this.modelInputs
          .find((input) => input.parameterId === param.parameterId)
          .id;
        const deleted = await this.deleteInputParameter(modelInputId);
        if (deleted) {
          await this.fetchModelDetails(this.model.modelid);
          const index = this.parameterList.findIndex((f) => f.parameterId === param.parameterId);
          if (index >= 0) this.parameterList.splice(index, 1);
        }
      }
    },
    async saveInputParam(param) {
      await Promise.all(this.modelInputs.map(async (element) => {
        const checkData = param.filter((f) => f === element.parameterId);
        if (checkData.length === 0) {
          await this.deleteInputParameter(element.id);
        }
      }));
      if (this.modelInputs.find((input) => input.parameterId === param[param.length - 1])) {
        // duplicate entry
      } else {
        const object = param[param.length - 1];
        if (object) {
          await this.createInputParameter({
            modelId: this.model.modelid,
            parameterId: object,
            selectedElement: this.realElement.elementName,
            parameterName: this.inputParametersList.find((f) => f.parameterId === object).name,
          });
        }
      }
      await this.fetchModelDetails(this.model.modelid);
    },
    async updateInputParameter(param) {
      if (param.selected) {
        await this.createInputParameter({
          modelId: this.model.modelid,
          parameterId: param.id,
          elementName: this.realElement.elementName,
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
