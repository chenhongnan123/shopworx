//inputpath (include wit) and outputpath

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
              <template v-if="typeof data.item !== 'object'">
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
      <v-autocomplete
          v-model="elementTags"
          :items="tagsList"
          filled
          class="ma-0 pa-0"
          chips
          color="primary"
          label="Select Tags"
          item-text="tagName"
          return-object
          hide-details
          multiple
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
            {{ data.item.tagName }}
          </v-chip>
          </template>
            <template v-slot:item="data">
              <template>
                <v-list-item-title v-html="data.item.tagName"></v-list-item-title>
          </template>
        </template>
      </v-autocomplete>
      <v-row
        class="mt-4"
        no-gutters
      >
      <v-col cols="6" md="6" lg="6">
      <v-text-field
        dense
        outlined
        type="datetime-local"
        v-model="oldStartTime"
        label="Old Train data start time*"
      ></v-text-field>
      </v-col>
      <v-col cols="6" md="6" lg="6">
      <v-text-field
        dense
        class="ml-2"
        outlined
        type="datetime-local"
        v-model="oldEndTime"
        label="Old Train data end time*"
      ></v-text-field>
      </v-col>
      </v-row>
      <v-row
        no-gutters
      >
      <v-col cols="6" md="6" lg="6">
      <v-text-field
        dense
        outlined
        type="datetime-local"
        v-model="newStartTime"
        label="New Train data start time*"
      ></v-text-field>
      </v-col>
      <v-col cols="6" md="6" lg="6">
      <v-text-field
        dense
        class="ml-2"
        outlined
        type="datetime-local"
        v-model="newEndTime"
        label="New Train data end time*"
      ></v-text-field>
      </v-col>
      </v-row>
      <v-textarea
        dense
        rows="3"
        outlined
        single-line
        v-model="configJson"
        label="Paste config JSON here"
        :rules="configRules"
      ></v-textarea>
      <span></span>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        class="text-none"
        @click="cancel"
      >
        Exit
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="text-none"
        @click="addData"
        :loading="loading"
      >
        Start Training
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CSVParser from '@shopworx/services/util/csv.service';

export default {
  name: 'modelTrigger',
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
      elementTags: null,
      configJson: '',
      oldStartTime: '',
      oldEndTime: '',
      newStartTime: '',
      newEndTime: '',
      search: '',
      loading: false,
      searchInput: null,
      selectedElementName: '',
      elementList: [],
      tagsList: [],
      configRules: [
        (v) => !!v || 'Configuration is required.',
        (v) => this.isValidJsonString(v) || 'Input valid JSON configuration.',
      ],
    };
  },
  computed: {
    ...mapState('modelManagement', ['criticalParameters', 'selectedSubstation', 'nonRealElementInfo', 'selectedModelObject', 'elementInformation', 'fileRecords']),
    modelTriggers() {
      return this.modelDetails && this.modelDetails.modelTriggers;
    },
    realElement: {
      get() {
        return this.modelTriggers;
      },
      set(val) {
        this.onElementSelect(val);
      },
    },
  },
  created() {
    this.elementList.push({
      header: 'Real ELement',
    });
    const object = {
      elementName: `process_${this.selectedSubstation}`,
    };
    this.elementList.push(object);
    this.realElement = [];
    this.selectedElementName = '';
    this.elementTags = [];
    this.oldStartTime = '';
    this.oldEndTime = '';
    this.newStartTime = '';
    this.newEndTime = '';
    this.configJson = '';
  },
  // 5,
  methods: {
    ...mapActions('modelManagement', [
      'createCriticalParameter',
      'deleteTriggerName',
      'fetchModelDetails',
      'addTriggerData',
      'createWebhook',
      'getNonRealElementInfo',
      'addModelTraningData',
      'fetchTrainingData',
      'getTagsForSelectedElement',
      'getRecordsByTagData',
    ]),
    cancel() {
      this.$emit('on-cancel');
    },
    isValidJsonString(jsonString) {
      if (!(jsonString && typeof jsonString === 'string')) {
        return false;
      }
      try {
        JSON.parse(jsonString);
        return true;
      } catch (error) {
        return false;
      }
    },
    async addData() {
      this.loading = true;
      const timestamp = new Date().getTime();
      const tagsList = [];
      this.elementTags.forEach((t) => {
        tagsList.push(t.tagName);
      });
      const oldDataStartTime = new Date(this.oldStartTime).getTime();
      const oldDataEndTime = new Date(this.oldEndTime).getTime();
      await this.getRecordsByTagData({
        elementName: this.selectedElementName,
        queryParam: `?datefrom=${oldDataStartTime}&dateto=${oldDataEndTime}&pagenumber=1&pagesize=500`,
        request: {
          tags: tagsList,
        },
      });
      // download file for old data
      let csvParser = new CSVParser();
      let content = csvParser.unparse({
        fields: tagsList,
        data: this.fileRecords,
      });
      let csvData = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      let csvURL = window.URL.createObjectURL(csvData);
      let testLink = document.createElement('a');
      testLink.href = csvURL;
      testLink.setAttribute('download', `${this.selectedElementName}-${timestamp}-old.csv`);
      testLink.click();
      // new data
      const newDataStartTime = new Date(this.newStartTime).getTime();
      const newDataEndTime = new Date(this.newEndTime).getTime();
      await this.getRecordsByTagData({
        elementName: this.selectedElementName,
        queryParam: `?datefrom=${newDataStartTime}&dateto=${newDataEndTime}&pagenumber=1&pagesize=500`,
        request: {
          tags: tagsList,
        },
      });
      // download file for new data
      csvParser = new CSVParser();
      content = csvParser.unparse({
        fields: tagsList,
        data: this.fileRecords,
      });
      csvData = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      csvURL = window.URL.createObjectURL(csvData);
      testLink = document.createElement('a');
      testLink.href = csvURL;
      testLink.setAttribute('download', `${this.selectedElementName}-${timestamp}.csv`);
      testLink.click();
      const oldStartTime = new Date(this.oldStartTime);
      const oldEndTime = new Date(this.oldEndTime);
      const newStartTime = new Date(this.newStartTime);
      const newEndTime = new Date(this.newEndTime);
      const object = {
        realelement: this.selectedElementName,
        oldtraindatastarttime: `${oldStartTime.getDay()}-${oldStartTime.getMonth() + 1}-${oldStartTime.getFullYear()}:${oldStartTime.getHours()}:${oldStartTime.getMinutes()}:${oldStartTime.getSeconds()}`,
        oldtraindataendtime: `${oldEndTime.getDay()}-${oldEndTime.getMonth() + 1}-${oldEndTime.getFullYear()}:${oldEndTime.getHours()}:${oldEndTime.getMinutes()}:${oldEndTime.getSeconds()}`,
        newtraindatastarttime: `${newStartTime.getDay()}-${newStartTime.getMonth() + 1}-${newStartTime.getFullYear()}:${newStartTime.getHours()}:${newStartTime.getMinutes()}:${newStartTime.getSeconds()}`,
        newtraindataendtime: `${newEndTime.getDay()}-${newEndTime.getMonth() + 1}-${newEndTime.getFullYear()}:${newEndTime.getHours()}:${newEndTime.getMinutes()}:${newEndTime.getSeconds()}`,
        configjson: this.configJson,
        inputfolder: `/home/emgda/shopworx/data/${this.selectedModelObject.name}-${timestamp}`,
        outputfolder: `/home/emgda/shopworx/model-output/${this.selectedModelObject.name}-${timestamp}`,
        inputfiles: [`${this.selectedElementName}-${timestamp}-old.csv`, `${this.selectedElementName}-${timestamp}.csv`],
        modelid: this.selectedModelObject.model_id,
        status: 'In Progress',
        trainingmode: 'Manual',
      };
      console.log(object);
      await this.addModelTraningData(object);
      await this.fetchTrainingData(this.selectedModelObject.model_id);
      this.elementList = [];
      this.elementList.push({
        header: 'Real ELement',
      });
      const object1 = {
        elementName: `process_${this.selectedSubstation}`,
      };
      this.elementList.push(object1);
      this.realElement = [];
      this.selectedElementName = '';
      this.elementTags = [];
      this.oldStartTime = '';
      this.oldEndTime = '';
      this.newStartTime = '';
      this.newEndTime = '';
      this.configJson = '';
      this.loading = false;
      this.cancel();
    },
    async onElementSelect(val) {
      // get tags for selected element
      console.log(val);
      this.selectedElementName = val.elementName;
      await this.getTagsForSelectedElement(this.selectedElementName);
      this.tagsList = this.elementInformation.tags;
    },
    async remove(param) {
      const deleted = await this.deleteTriggerName(param.triggerName);
      if (deleted) {
        await this.fetchModelDetails(this.model.model_id);
        const index = this.realElement.findIndex((f) => f.triggerName === param.triggerName);
        if (index >= 0) this.realElement.splice(index, 1);
      }
    },
    async saveInputParam(param) {
      await Promise.all(this.modelTriggers.map(async (element) => {
        const checkData = param.filter((f) => f === element.parameterId);
        if (checkData.length === 0) {
          await this.deleteCriticalParameter(element.id);
        }
      }));
      if (this.modelTriggers.find((input) => input.parameterId === param[param.length - 1])) {
        // duplicate entry
      } else {
        const object = param[param.length - 1];
        if (object) {
          await this.createCriticalParameter({
            modelId: this.model.model_id,
            maxLimit: this.maxlimit,
            minLimit: this.minlimit,
            parameterId: object,
          });
        }
      }
      await this.fetchModelDetails(this.model.model_id);
    },
    async updateInputParameter(param) {
      if (param.selected) {
        await this.createCriticalParameter({
          modelId: this.model.model_id,
          maxLimit: this.maxlimit,
          minLimit: this.minlimit,
          parameterId: param.id,
        });
      } else {
        const modelInputId = this.modelTriggers
          .find((input) => input.parameterId === param.id)
          .id;
        this.deleteCriticalParameter(modelInputId);
      }
    },
  },
};
</script>
