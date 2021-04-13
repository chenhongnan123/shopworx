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
          item-value="elemenName"
          hide-details
          @change="onElementSelect"
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
import { mapState, mapActions, mapMutations } from 'vuex';
// import CSVParser from '@shopworx/services/util/csv.service';

export default {
  name: 'modelTrigger',
  props: {
    // modelDetails: {
    //   type: Object,
    //   required: true,
    // },
    // model: {
    //   type: Object,
    //   required: true,
    // },
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        // set real Element
        this.elementList = [];
        this.elementList.push({
          header: 'Real ELement',
        });
        const object = {
          elementName: `process_${this.selectedSubstation}`,
        };
        this.elementList.push(object);
        const firstVal = object.elementName;
        this.onElementSelect(object.elementName);
        this.realElement = firstVal;
      }
    },
  },
  created() {
    if (this.dialog) {
      // set real Element
      this.elementList = [];
      this.elementList.push({
        header: 'Real ELement',
      });
      const object = {
        elementName: `process_${this.selectedSubstation}`,
      };
      this.elementList.push(object);
      const firstVal = object.elementName;
      this.onElementSelect(object.elementName);
      this.realElement = firstVal;
    }
  },
  data() {
    return {
      realElement: null,
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
    // realElement: {
    //   get() {
    //     console.log(this.modelTriggers);
    //     return this.modelTriggers;
    //   },
    //   set(val) {
    //     console.log(val);
    //     this.onElementSelect(val);
    //   },
    // },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
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
      'postStreamRecords',
      'getModelInputs',
    ]),
    isObjectType(item) {
      return typeof item !== 'object';
    },
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
      const timestamp = new Date().getTime();
      const tagsList = [];
      console.log(this.elementTags);
      this.elementTags.forEach((t) => {
        tagsList.push(t.tagName);
      });
      if (tagsList.includes('mainid') && tagsList.includes('timestamp') && tagsList.includes('productionstatus')) {
        const oldStartTime = new Date(this.oldStartTime);
        const oldEndTime = new Date(this.oldEndTime);
        const newStartTime = new Date(this.newStartTime);
        const newEndTime = new Date(this.newEndTime);
        console.log(oldStartTime);
        const payload = {
          realelement: this.selectedElementName,
          tagslist: tagsList,
          olddatastarttimestamp: new Date(this.oldStartTime).getTime(),
          olddataendtimestamp: new Date(this.oldEndTime).getTime(),
          olddatafilename: `${this.selectedElementName}-${timestamp}-old.csv`,
          newdatastarttimestamp: new Date(this.newStartTime).getTime(),
          newdataendtimestamp: new Date(this.newEndTime).getTime(),
          newdatafilename: `${this.selectedElementName}-${timestamp}.csv`,
          oldtraindatastarttime: `${oldStartTime.getDay()}-${oldStartTime.getMonth() + 1}-${oldStartTime.getFullYear()}:${oldStartTime.getHours()}:${oldStartTime.getMinutes()}:${oldStartTime.getSeconds()}`,
          oldtraindataendtime: `${oldEndTime.getDay()}-${oldEndTime.getMonth() + 1}-${oldEndTime.getFullYear()}:${oldEndTime.getHours()}:${oldEndTime.getMinutes()}:${oldEndTime.getSeconds()}`,
          newtraindatastarttime: `${newStartTime.getDay()}-${newStartTime.getMonth() + 1}-${newStartTime.getFullYear()}:${newStartTime.getHours()}:${newStartTime.getMinutes()}:${newStartTime.getSeconds()}`,
          newtraindataendtime: `${newEndTime.getDay()}-${newEndTime.getMonth() + 1}-${newEndTime.getFullYear()}:${newEndTime.getHours()}:${newEndTime.getMinutes()}:${newEndTime.getSeconds()}`,
          configjson: this.configJson,
          inputfolder: `/home/emgda/shopworx/data/${this.selectedModelObject.name}-${timestamp}`,
          outputfolder: `/home/emgda/shopworx/model-output/${this.selectedModelObject.name}-${timestamp}`,
          inputfiles: [`${this.selectedElementName}-${timestamp}-old.csv`, `${this.selectedElementName}-${timestamp}.csv`],
          modelid: this.selectedModelObject.modelid,
          status: 'In Progress',
          trainingmode: 'Manual',
        };
        this.addModelTraningData(payload);
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
      } else if (!this.oldStartTime || !this.oldEndTime
        || !this.newStartTime || !this.newEndTime) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MANDATORY_DATE&TIME_FIELDS',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'TRAINING_TAGS_REQUIRED',
        });
      }
    },
    async onElementSelect(val) {
      this.elementTags = [];
      // get tags for selected element
      console.log(val);
      this.selectedElementName = val;
      console.log(this.selectedElementName);
      await this.getTagsForSelectedElement(this.selectedElementName);
      this.tagsList = this.elementInformation.tags;
      console.log(this.tagsList);
      const list = await this.getModelInputs(`?query=modelid=="${this.selectedModelObject.modelid}"`);
      console.log(list.modelInputs);
      list.modelInputs.forEach((f) => {
        const tagData = this.tagsList.find((tag) => tag.tagName === f.tagName);
        if (tagData) {
          this.elementTags.push(tagData);
        }
      });
      // this.elementTags = modelInputs;
    },
    async remove(param) {
      const dataMainid = this.elementTags.find((f) => f.id === param.id);
      if (dataMainid.tagName === 'mainid'
         || dataMainid.tagName === 'timestamp'
         || dataMainid.tagName === 'productionstatus') {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'NOT_DELETE_MAINID',
        });
      } else {
        const index = this.elementTags.findIndex((f) => f.tagName === param.tagName);
        if (index >= 0) this.elementTags.splice(index, 1);
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
            modelId: this.model.modelid,
            maxLimit: this.maxlimit,
            minLimit: this.minlimit,
            parameterId: object,
          });
        }
      }
      await this.fetchModelDetails(this.model.modelid);
    },
    async updateInputParameter(param) {
      if (param.selected) {
        await this.createCriticalParameter({
          modelId: this.model.modelid,
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
