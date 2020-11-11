<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <portal to="app-header">ML Model</portal>
        <v-row>
          <v-col cols="6" md="6" lg="6">
            <v-combobox
              style="float: left; width: 30%;"
              dense
              outlined
              label="Line"
              :items="lines"
              item-text="name"
              return-object
              v-model="selectedLine"
            >
            </v-combobox>
          </v-col>
          <v-col cols="6" md="6" lg="6">
          <v-btn style="float: right;" :disabled="!selectedProcess"
            small color="primary" class="text-none mt-2 mr-2"
            @click="dialogDeploy = true">
            Deploy Model
          </v-btn>
          </v-col>
        </v-row>
        <v-row class="mb-6" v-if="selectedLine"
           no-gutters>
                <v-col>
                  <v-card
                  class="pa-2"
                  tile
                  outlined>
                  Subline
                  <AddSubline :lineid="selectedLine.id"/>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card
                  class="pa-2"
                  tile
                  outlined>
                  Station
                  <AddStation :lineid="selectedLine.id"/>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card
                  class="pa-2"
                  tile
                  outlined>
                  <span class="ml-0">SubStation</span>
                  <AddSubstation :lineid="selectedLine.id"/>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card
                  class="pa-2"
                  tile
                  outlined>
                  <span class="ml-0">Sub Process</span>
                  <AddProcess />
                  </v-card>
                </v-col>
           </v-row>
        <v-row class="pa-1 mx-1 grid_row" :key="subline._id" v-for="subline in sublines">
  <v-col cols="3" md="3" lg="3" class="py-0">
    <div>{{ subline.name }}
    </div>
  </v-col>
  <v-col cols="9" md="9" lg="9" class="py-0">
      <v-row :key="station._id" v-for="station in stations
      .filter((s) => subline.id === s.sublineid)">
        <v-col cols="4" md="4" lg="4" class="py-0">
          <div>{{ station.name }}
          </div>
        </v-col>
        <v-col cols="8" md="8" lg="8" class="py-0">
          <v-row :key="substation._id" v-for="substation in subStations
          .filter((ss) => station.id === ss.stationid)">
            <v-col cols="6" md="6" lg="6" class="py-0">
              <!-- <div :class="{ 'my-text-style': substation.lineid===1}"> -->
                <div>
                {{ substation.name }}
              </div>
            </v-col>
            <v-col cols="6" md="6" lg="6" class="py-0">
              <v-row :key="process._id" v-for="process in processes
              .filter((p) => substation.id === p.substationid)">
                <v-col cols="12" md="12" lg="12" class="py-0">
                <div @click="onProcessClick(process)"><a>{{ process.name }}</a>
                  <AddModel :payload="process" />
                </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
  </v-col>
</v-row>
      </v-col>
    </v-row>
    <v-expansion-panels accordion class="mt-4" v-if="selectedProcess">
          <v-expansion-panel
            v-for="(data, index) in processModelList"
            :key="index"
          >
            <v-expansion-panel-header class="primary--text">
              <span>
                <v-icon v-if="data.filelist.length === 0"
                  left v-text="'$delete'" color="error" @click="deleteModel(data)"></v-icon>
                {{ data.modelname }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="mb-6" v-if="selectedProcess" no-gutters>
                <v-col cols="4" md="4" lg="4">
                  <v-card v-if="selectedProcess" class="pa-2" tile outlined style="width: 98%">
                    <a>{{selectedProcess}}</a> : Input
                    <v-icon style="float: right; margin-bottom: 23px;"
                      v-if="selectedProcess" @click="onAddbtnClick(data)" v-text="'$plus'"></v-icon>
                    <v-autocomplete
                      clearable
                      label="Input"
                      :items="selectedParameterList"
                      item-text="description"
                      return-object
                      prepend-icon="$production"
                      v-model="selectedInput"
                    >
                      <template v-slot:item="{ item }">
                        <v-list-item-content>
                          <v-list-item-title v-text="item.description"></v-list-item-title>
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                    <div v-for="input in data.inputlist" :key="input._id">
                      <v-text-field
                        v-if="input.name !== ''"
                        :value="parameterList.find((f) => f.id === input.parameterid).description"
                        solo
                        disabled
                        style="width: 80%;margin-top: -5px; margin-bottom: -16px;"
                      ></v-text-field>
                      <div v-if="input.name !== ''">
                        <DeleteProcessInputs :payload="input"/>
                      </div>
                    </div>
                  </v-card>
                  <v-card v-else class="pa-2" tile outlined style="text-align: center; width: 98%">
                    Data Not available</v-card>
                </v-col>
                <v-col cols="4" md="4" lg="4">
                  <v-card class="pa-2" tile outlined style="width: 98%"> Machine Learning Model
                    <AddMachineModel :payload="payloadData" :selectedmodel="data"/>
                    <div v-for="input in data.filelist" :key="input._id">
                      <v-text-field
                        v-if="input._id !== ''"
                        :value="input._id"
                        solo
                        disabled
                        style="width: 80%;margin-top: -5px; margin-bottom: -16px;"
                      ></v-text-field>
                      <div v-if="input._id !== ''">
                        <DeleteMachineModel :payload="input" :selectedmodel="data"/>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="4" md="4" lg="4">
                  <v-card class="pa-2" tile outlined> Output
                    <v-row :key="list._id" v-for="list in mlTransformationOutputList">
                        <v-col cols="4" md="4" lg="4" class="py-0 ml-4 mt-2">
                          <v-row>
                            <v-checkbox
                              class="ma-0 mb-2"
                              hide-details
                              :input-value="data.outputlist.find((f) => f
                                .mltransformationoutputid === list._id)"
                              @change="btnCheckBox($event, list, data)"></v-checkbox>
                            {{ list.name }}
                          </v-row>
                        </v-col>
                      </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    <v-dialog v-model="dialogDeploy" max-width="500">
    <v-card>
      <v-card-title class="headline"
        >Deploy models with Process - {{ selectedProcess }}?
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialogDeploy = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" @click="btnDeployModel">
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogModel" max-width="500">
    <v-card>
      <v-card-title class="headline"
        >Deploy Model?
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialogModel = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" @click="btnDeleteModel">
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import DeleteProcessInputs from '../components/DeleteProcessInputs.vue';
import AddMachineModel from '../components/AddMachineModel.vue';
import DeleteMachineModel from '../components/DeleteMachineModel.vue';
import AddModel from '../components/AddModel.vue';

export default {
  name: 'ModelManagement',
  components: {
    DeleteProcessInputs,
    AddMachineModel,
    DeleteMachineModel,
    AddModel,
  },
  payloadData: {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('modelManagement', ['setSelectedParameterList']),
    ...mapActions('modelManagement', [
      'getLines',
      'getStations',
      'getProcesses',
      'getSublines',
      'getSubStations',
      'addOutputRecordss',
      'getMlTransformationOutputList',
      'deleteOutputRecords',
      'getOutputRecords',
      'getInputRecords',
      'addInputRecords',
      'addDeployModel',
      'getModelRecords',
      'deleteModelById',
      'getModelFiles',
    ]),
    ...mapActions('parameterConfiguration', [
      'getPageDataList',
      'getParameterListRecords',
    ]),
    async btnDeployModel() {
      const object = {
        lineid: this.payloadData.lineid,
        stationid: this.payloadData.stationid,
        processid: this.payloadData.processid,
        status: 'Pending',
        operationname: 'Deploy Model',
        assetid: 4,
      };
      const response = await this.addDeployModel(object);
      if (response) {
        this.selectedProcess = null;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MODEL_DEPLOYED',
        });
        this.dialogDeploy = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DEPLOYMODEL',
        });
      }
    },
    async btnDeleteModel() {
      const deleted = await this.deleteModelById(this.selectedDataForDelete._id);
      if (deleted) {
        await this.getModelRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"%26%26subprocessid=="${this.payloadData.processid}"`);
        // add new logic
        await this.getMlTransformationOutputList('');
        this.processModelList.forEach(async (model) => {
          model.inputlist = await this.getInputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
          %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
          model.outputlist = await this.getOutputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
          %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
          model.filelist = await this.getModelFiles(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
          %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
        });
        this.dialogModel = false;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MODEL_DELETE',
        });
        this.dialogDeploy = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETE_MODEL',
        });
      }
    },
    async deleteModel(data) {
      this.selectedDataForDelete = data;
      this.dialogModel = true;
    },
    async btnCheckBox(event, item, data) {
      if (event) {
        const payload = {
          modelid: data._id,
          lineid: this.payloadData.lineid,
          stationid: this.payloadData.stationid,
          subprocessid: this.payloadData.processid,
          mltransformationoutputid: item._id,
          assetid: 4,
        };
        const created = await this.addOutputRecordss(payload);
        if (created) {
          await this.getOutputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
            %26%26processid=="${this.payloadData.processid}"`);
          this.setAlert({
            show: true,
            type: 'success',
            message: 'OUTPUT_PROCESS',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_OUTPUT_PROCESS',
          });
        }
      } else {
        const idToDelete = this.processOutputList.find((f) => f
          .mltransformationoutputid === item._id);
        console.log(idToDelete);
        const deleted = this.deleteOutputRecords(idToDelete._id);
        if (deleted) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'DELETE_OUTPUT_PROCESS',
          });
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_DELETE_OUTPUT',
          });
        }
      }
    },
    async onLineChange() {
      await this.getStations('');
      await this.getProcesses('');
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getSubStations('');
      this.selectedProcess = null;
    },
    async onAddbtnClick(data) {
      console.log(data);
      console.log(this.selectedInput);
      const payload = {
        modelid: data._id,
        assetid: 4,
        lineid: this.selectedInput.lineid,
        stationid: this.selectedInput.stationid,
        subprocessid: this.processId,
        parameterid: this.selectedInput.id,
      };
      const response = await this.addInputRecords(payload);
      if (response) {
        // this.selectedParameterList.splice(this.selectedParameterList
        //   .indexOf(this.selectedInput), 1);
        // this.setSelectedParameterList(this.selectedParameterList);
        // await this.getInputRecords
        // (`?query=lineid==${this.selecte
        // dInput.lineid}%26%26stationid=="${this.selectedInput.stationid}"
        //   %26%26processid=="${payload.processid}"`);
        await this.getMlTransformationOutputList('');
        await this.getModelRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"%26%26subprocessid=="${this.payloadData.processid}"`);
        // add new logic
        this.processModelList.forEach(async (model) => {
          model.inputlist = await this.getInputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
          %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
          model.outputlist = await this.getOutputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
          %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
          model.filelist = await this.getModelFiles(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
          %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
        });
        this.setAlert({
          show: true,
          type: 'success',
          message: 'INPUT_PROCESS_ADDED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_ADDING_INPUT',
        });
      }
    },
    compare(a, b) {
      if (a.description < b.description) {
        return -1;
      }
      if (a.description > b.description) {
        return 1;
      }
      return 0;
    },
    async onProcessClick(process) {
      this.setSelectedParameterList([]);
      this.payloadData = {
        lineid: 0,
        processid: '',
        stationid: '',
      };
      this.processId = process.id;
      this.payloadData.lineid = process.lineid;
      this.payloadData.processid = process.id;
      this.payloadData.stationid = this.subStations.find((f) => f.id === process.substationid)
        .stationid;
      this.selectedParameterList = [];
      this.selectedProcess = process.name;
      this.parameterList.forEach((parameter) => {
        if (parameter.parametercategory === 51) {
          this.selectedParameterList.push(parameter);
        }
      });
      await this.getMlTransformationOutputList('');
      await this.getModelRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"%26%26subprocessid=="${this.payloadData.processid}"`);
      // add new logic
      this.processModelList.forEach(async (model) => {
        model.inputlist = await this.getInputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
        %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
        model.outputlist = await this.getOutputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
        %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
        model.filelist = await this.getModelFiles(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
        %26%26subprocessid=="${this.payloadData.processid}"%26%26modelid=="${model._id}"`);
      });
      // await this.getMlTransformationOutputList('');
      // await this.getOutputRecords(`?query=lineid==${this.payloadData.
      // lineid}%26%26stationid=="${this.payloadData.stationid}"
      //   %26%26processid=="${this.payloadData.processid}"`);
      // await this.getInputRecords(`?query=lineid==${this.payloadData.
      // lineid}%26%26stationid=="${this.payloadData.stationid}"
      //   %26%26processid=="${this.payloadData.processid}"`);
      // this.processIntputList.forEach((f) => {
      //   const usedObject = this.selectedParameterList.find((p) => p.id === f.parameterid);
      //   this.selectedParameterList.splice(this.selectedParameterList.indexOf(usedObject), 1);
      // });
      // this.selectedParameterList = this.selectedParameterList.sort(this.compare);
      // this.setSelectedParameterList(this.selectedParameterList);
    },
  },
  computed: {
    ...mapState('modelManagement', [
      'lines',
      'stations',
      'processes',
      'sublines',
      'subStations',
      'mlTransformationOutputList',
      'processOutputList',
      'processIntputList',
      'processModelList',
      'selectedParameterList',
    ]),
    ...mapState('parameterConfiguration', ['parameterList', 'categoryList']),
  },
  data() {
    return {
      selectedDataForDelete: null,
      dialogModel: false,
      isClicked: false,
      dialogDeploy: false,
      selectedLine: null,
      inputProcessParameters: [],
      selectedProcess: null,
      selectedInput: [],
      filteredInput: null,
      description: null,
      path: null,
      inputPayload: [],
      processId: null,
      count: 0,
      payload: [],
    };
  },
  async created() {
    const success = await this.getLines();
    if (success) {
      [this.selectedLine] = this.lines;
    }
    await this.getPageDataList();
    await this.getParameterListRecords('?pagenumber=1&pagesize=10');
  },
  watch: {
    selectedLine: {
      handler() {
        this.onLineChange();
      },
    },
  },
};
</script>
<style scoped>
div .pa-1:nth-of-type(odd) {
    background-color:  rgba(255,255,255,.05);
    border-color: #454d55;
    border-bottom: 1px solid rgba(243, 243, 247, 0.25);
  }
div .pa-1:nth-of-type(even) {
    border-color: #454d55;
    border-bottom: 1px solid rgba(243, 243, 247, 0.25);
  }
.row .pa-1:nth-of-type(odd) {
    border-bottom: 1px solid rgba(198, 198, 212, 0.35);
  }
.row .pa-1:nth-of-type(even) {
    border-bottom: 1px solid rgba(198, 198, 212, 0.35);
  }
.theme--light.v-application .row .pa-1:nth-of-type(odd) {
    background-color: #F5F5F5;
  }
.my-text-style{
  color: red;
}
.green--text{
  color: green;
}
</style>
