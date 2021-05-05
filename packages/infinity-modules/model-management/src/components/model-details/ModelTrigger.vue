<template>
  <v-card flat>
    <v-card-text class="pt-0">
       <v-autocomplete
          v-model="nonRealElement"
          :items="elementList"
          filled
          class="ma-0 pa-0"
          chips
          color="primary"
          label="Select element"
          item-text="triggerName"
          return-object
          hide-details
          multiple
          @input="searchInput=null"
          :search-input.sync="searchInput"
        >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            color="primary"
            @click="data.select"
          >
            {{ data.item.triggerName }}
          </v-chip>
          </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item"></v-list-item-content>
              </template>
              <template v-else>
                <v-list-item-content>
                <v-list-item-title v-html="data.item.triggerName"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
      <div class="caption">*Required field</div>
      <span></span>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

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
      search: '',
      searchInput: null,
      elementList: [],
    };
  },
  computed: {
    ...mapState('modelManagement', ['criticalParameters', 'selectedSubstation', 'nonRealElementInfo']),
    modelTriggers() {
      return this.modelDetails && this.modelDetails.modelTriggers;
    },
    nonRealElement: {
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
      header: 'Non Real ELement',
    });
    const object = {
      triggerName: `production_${this.selectedSubstation}`,
    };
    this.elementList.push(object);
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
    ]),
    async onElementSelect(val) {
      // add data to new element and add entry to webhook table
      if (this.modelTriggers.length > 0
        && this.modelTriggers[0].triggerName === val[0].triggerName) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'TRIGGER_ADDED',
        });
      } else {
        const object = {
          modelid: this.model.modelid,
          triggername: val[0].triggerName,
          eventname: `event_${val[0].triggerName}`,
        };
        const result = await this.addTriggerData(object);
        if (result) {
          await this.getNonRealElementInfo(val[0].triggerName);
          // add entry to webhook table
          const webhookObject = {
            webhookURL: `http://localhost:10190/update/${val[0].triggerName}`,
            elementId: this.nonRealElementInfo.element.id,
            callbackType: 'WRITE',
          };
          await this.createWebhook(webhookObject);
        }
      }
    },
    async remove(param) {
      const deleted = await this.deleteTriggerName(param.triggerName);
      if (deleted) {
        await this.fetchModelDetails(this.model.modelid);
        const index = this.nonRealElement.findIndex((f) => f.triggerName === param.triggerName);
        if (index >= 0) this.nonRealElement.splice(index, 1);
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
