<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <portal to="app-header">Model Management</portal>
        <v-row>
          <v-col cols="2" md="2" lg="2">
            <v-combobox
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
        </v-row>
        <v-row class="mb-6" v-if="selectedLine" no-gutters>
          <v-col cols="3" md="3" lg="3">
            <v-card
            class="pa-2"
            tile
            outlined>
            Line/Host
            </v-card>
          </v-col>
          <v-col cols="3" md="3" lg="3">
            <v-card
            class="pa-2"
            tile
            outlined>
            Station
            </v-card>
          </v-col>
          <v-col cols="3" md="3" lg="3">
            <v-card
            class="pa-2"
            tile
            outlined>
            Sub Process
            </v-card>
          </v-col>
        </v-row>
        <!-- <v-row class="pa-1 mx-1 grid_row"> -->
          <v-row class="pa-1 mx-1 grid_row" :key="subline._id" v-for="subline in sublines">
          <!-- <v-col v-if="selectedLine" cols="3" md="3" lg="3"> -->
          <div class="pl-2">{{ selectedLine.name }}</div>
          <!-- </v-col> -->
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
                      <div @click="onProcessClick(process.name)" >
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
        <!-- </v-row> -->
      </v-col>
    </v-row>
    <v-row class="mb-6" v-if="selectedProcess" no-gutters>
      <v-col cols="3" md="3" lg="3">
        <v-card v-if="inputProcessParameters.length" class="pa-2" tile outlined>
          {{selectedProcess}} : Input
          <v-select
            v-for="(input, index) in inputArr"
            :key="input._id"
            dense
            outlined
            label="Input"
            :items="inputProcessParameters"
            item-text="name"
            return-object
            v-model="selectedInput[index]"
            style="width: 80%; padding-top: 10px;"
          >
          </v-select>
          <v-btn v-if="selectedInput" @click="onAddbtnClick()">+</v-btn>
        </v-card>
        <v-card v-else class="pa-2" tile outlined style="text-align: center;">
          Data Not available</v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ModelManagement',
  methods: {
    ...mapActions('modelManagement', ['getLines', 'getStations', 'getProcesses', 'getSublines', 'getSubStations']),
    ...mapActions('parameterConfiguration', ['getPageDataList', 'getParameterListRecords']),
    async onLineChange() {
      await this.getStations('');
      await this.getProcesses('');
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getSubStations('');
      this.selectedProcess = null;
    },
    onAddbtnClick() {
      this.inputArr = [{ name: '' }];
      for (let index = 0; index < this.selectedInput.length; index += 1) {
        this.inputArr.push({ name: this.selectedInput[index] });
      }
      for (let index = 0; index < this.inputProcessParameters.length; index += 1) {
        if (this.inputProcessParameters[index] === this.inputArr[1]) {
          this.inputProcessParameters.splice(index, 1);
        }
      }
    },
    onProcessClick(process) {
      const paramterSelected = [];
      this.selectedProcess = process;
      this.parameterList.forEach((parameter) => {
        if (parameter.parametercategory === 51) {
          paramterSelected.push(parameter);
        }
      });
      paramterSelected.forEach((parameter) => {
        if (parameter.line === this.selectedLine.name) {
          this.inputProcessParameters.push(parameter.description);
        } else {
          this.inputProcessParameters = [];
        }
      });
    },
  },
  computed: {
    ...mapState('modelManagement', ['lines', 'stations', 'processes', 'sublines', 'subStations']),
    ...mapState('parameterConfiguration', ['parameterList', 'categoryList']),
  },
  data() {
    return {
      selectedLine: null,
      inputProcessParameters: [],
      selectedProcess: null,
      selectedInput: [],
      inputArr: [{
        name: '',
      }],
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
    // selectedProcess: {
    //   handler() {
    //     this.onProcessClick(this.selectedProcess);
    //   },
    // },
  },
};
</script>
