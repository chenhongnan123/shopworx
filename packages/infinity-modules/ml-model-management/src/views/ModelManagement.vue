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
              label="Line/Host"
              :items="lines"
              item-text="name"
              return-object
              v-model="selectedLine"
            >
            </v-combobox>
          </v-col>
          <v-col cols="6" md="6" lg="6">
          <v-btn style="float: right;" small color="primary" class="text-none mt-2 mr-2"
            @click="btnDeployModel">
            Deploy Model
          </v-btn>
          </v-col>
        </v-row>
        <v-row class="mb-6" v-if="selectedLine" no-gutters>
          <v-col cols="4" md="4" lg="4">
            <v-card
            class="pa-2"
            tile
            outlined>
            Line/Host
            </v-card>
          </v-col>
          <v-col cols="4" md="4" lg="4">
            <v-card
            class="pa-2"
            tile
            outlined>
            Station
            </v-card>
          </v-col>
          <v-col cols="4" md="4" lg="4">
            <v-card
            class="pa-2"
            tile
            outlined>
            Sub Process
            </v-card>
          </v-col>
        </v-row>
        <v-row class="pa-1 mx-1 grid_row"
          :key="subline._id" v-for="subline in sublines">
        <div class="pl-2">{{ selectedLine.name }}</div>
          <v-spacer></v-spacer>
          <v-col cols="9" md="9" lg="9" class="py-0">
            <v-row :key="station._id" v-for="station in stations
            .filter((s) => subline.id === s.sublineid)">
              <v-col cols="4" md="4" lg="4" class="py-0">
                <div class="pl-2">{{ station.name }}</div>
              </v-col>
              <v-col cols="8" md="8" lg="8" class="py-0">
                <v-row :key="substation._id" v-for="substation in subStations
                .filter((ss) => station.id === ss.stationid)">
                <v-col cols="6" md="6" lg="6" class="py-0">
                  <v-row :key="process._id" v-for="process in processes
                  .filter((p) => substation.id === p.substationid)">
                    <v-col cols="12" md="12" lg="12" class="py-0">
                    <div @click="onProcessClick(process)" >
                      {{ process.name }}
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
    <v-row class="mb-6" v-if="selectedProcess" no-gutters>
      <v-col cols="4" md="4" lg="4">
        <v-card v-if="paramterSelected.length" class="pa-2" tile outlined style="width: 98%">
          {{selectedProcess}} : Input
          <v-icon style="float: right; width: 15%; margin-bottom: 10px;"
            v-if="paramterSelected.length" @click="onAddbtnClick()" v-text="'$plus'"></v-icon>
          <!-- <v-select
            dense
            outlined
            label="Input"
            :items="paramterSelected"
            item-text="description"
            return-object
            v-model="selectedInput"
            style="width: 80%; margin-top: 15px;"
          >
          </v-select> -->
          <v-autocomplete
            clearable
            label="Input"
            :items="paramterSelected"
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
          <div v-for="input in processIntputList" :key="input._id">
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
          <AddMachineModel :payload="payloadData"/>
          <div v-for="input in processModelList" :key="input._id">
            <v-text-field
              v-if="input.modelname !== ''"
              :value="input.modelname"
              solo
              disabled
              style="width: 80%;margin-top: -5px; margin-bottom: -16px;"
            ></v-text-field>
            <div v-if="input.modelname !== ''">
              <DeleteMachineModel :payload="input"/>
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
                    :input-value="processOutputList.find((f) => f
                      .mltransformationoutputid === list._id)"
                    @change="btnCheckBox($event, list)"></v-checkbox>
                  {{ list.name }}
                </v-row>
              </v-col>
            </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import DeleteProcessInputs from '../components/DeleteProcessInputs.vue';
import AddMachineModel from '../components/AddMachineModel.vue';
import DeleteMachineModel from '../components/DeleteMachineModel.vue';

export default {
  name: 'ModelManagement',
  components: {
    DeleteProcessInputs,
    AddMachineModel,
    DeleteMachineModel,
  },
  payloadData: {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
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
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DEPLOYMODEL',
        });
      }
    },
    async btnCheckBox(event, item) {
      if (event) {
        const payload = {
          lineid: this.payloadData.lineid,
          stationid: this.payloadData.stationid,
          processid: this.payloadData.processid,
          mltransformationoutputid: item._id,
          assetid: 4,
        };
        this.addOutputRecordss(payload);
      } else {
        const idToDelete = this.processOutputList.find((f) => f
          .mltransformationoutputid === item._id);
        console.log(idToDelete);
        this.deleteOutputRecords(idToDelete._id);
      }
    },
    async onLineChange() {
      await this.getMlTransformationOutputList('');
      await this.getStations('');
      await this.getProcesses('');
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getSubStations('');
      this.selectedProcess = null;
    },
    async onAddbtnClick() {
      console.log(this.selectedInput);
      const payload = {
        assetid: 4,
        lineid: this.selectedInput.lineid,
        stationid: this.selectedInput.stationid,
        processid: this.processId,
        parameterid: this.selectedInput.id,
      };
      const response = await this.addInputRecords(payload);
      if (response) {
        this.paramterSelected.splice(this.paramterSelected.indexOf(this.selectedInput), 1);
        await this.getInputRecords(`?query=lineid==${this.selectedInput.lineid}%26%26stationid=="${this.selectedInput.stationid}"
          %26%26processid=="${payload.processid}"`);
      }
    },
    async onProcessClick(process) {
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
      this.paramterSelected = [];
      this.selectedProcess = process.name;
      this.parameterList.forEach((parameter) => {
        if (parameter.parametercategory === 51) {
          this.paramterSelected.push(parameter);
        }
      });
      this.paramterSelected = this.paramterSelected.sort((a, b) => b.description - a.description);
      // paramterSelected.forEach((parameter) => {
      //   if (parameter.line === this.selectedLine.name) {
      //     this.inputProcessParameters.push(parameter.description);
      //     // this.filteredInput = this.inputProcessParameters;
      //   } else {
      //     this.inputProcessParameters = [];
      //   }
      // });
      // get all records
      await this.getOutputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
        %26%26processid=="${this.payloadData.processid}"`);
      await this.getInputRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
        %26%26processid=="${this.payloadData.processid}"`);
      this.processIntputList.forEach((f) => {
        const usedObject = this.paramterSelected.find((p) => p.id === f.parameterid);
        this.paramterSelected.splice(this.paramterSelected.indexOf(usedObject), 1);
      });
      await this.getModelRecords(`?query=lineid==${this.payloadData.lineid}%26%26stationid=="${this.payloadData.stationid}"
        %26%26processid=="${this.payloadData.processid}"`);
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
    ]),
    ...mapState('parameterConfiguration', ['parameterList', 'categoryList']),
  },
  data() {
    return {
      paramterSelected: [],
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
