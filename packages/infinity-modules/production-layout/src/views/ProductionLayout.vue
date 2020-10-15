<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <portal to="app-header">Production Layout</portal>
        <v-row>
          <!-- {{lines}} -->
          <v-col cols="2" md="2" lg="2">
            <v-select
              label="Line"
              :items="lines"
              item-text="name"
              return-object
              v-model="selectedLine"
              @change="onLineChange"
            >
            </v-select>
          </v-col>
          <template v-if="selectedLine">
            <v-col cols="2" md="2" lg="2">
              <v-text-field
                label="Line Name"
                v-model="selectedLine.name"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="2" md="2" lg="2">
              <v-text-field
                label="Line Description"
                v-model="selectedLine.description"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="2" md="2" lg="2">
              <v-text-field label="Expected OEE"
                v-model="selectedLine.expectedoee"></v-text-field>
            </v-col>
            <v-col cols="2" md="2" lg="2">
              <v-text-field label="Expected CT"
                v-model="selectedLine.expectedcycletime"></v-text-field>
            </v-col> -->
            <v-col cols="1" md="1" lg="1">
              <SelectedLineUpdate />
            </v-col>
          </template>
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
                  <span class="ml-0">Process</span>
                  <AddProcess />
                  </v-card>
                </v-col>
           </v-row>
           <!-- <v-row
      v-if="selectedLine"
      class="mb-6"
      no-gutters>
      <v-col>
        <v-card
          class="pa-2"
          tile
          outlined
          v-text="$t('headers.subline')">
          <AddSubline :lineid="selectedLine.id"/>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="pa-2"
          tile
          outlined
          v-text="$t('headers.station')">
          <AddStation :lineid="selectedLine.id"/>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="pa-2"
          tile
          outlined
          v-text="$t('headers.substation')">
          <AddSubstation/>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          class="pa-2"
          tile
          outlined
          v-text="$t('headers.process')">
        </v-card>
      </v-col>
    </v-row> -->
<v-row class="pa-1 mx-1 grid_row" :key="subline._id" v-for="subline in sublines">
  <v-col cols="3" md="3" lg="3" class="py-0">
    <div>{{ subline.name }}
      <DeleteSubline :subline="subline" />
      <UpdateSubline :subline="subline" :lineid="selectedLine.id"/>
    </div>
  </v-col>
  <v-col cols="9" md="9" lg="9" class="py-0">
      <v-row :key="station._id" v-for="station in stations
      .filter((s) => subline.id === s.sublineid)">
        <v-col cols="4" md="4" lg="4" class="py-0">
          <div class="pl-2">{{ station.name }}
            <DeleteStation :station="station" />
            <UpdateStation :station="station" />
          </div>
        </v-col>
        <v-col cols="8" md="8" lg="8" class="py-0">
          <v-row :key="substation._id" v-for="substation in subStations
          .filter((ss) => station.id === ss.stationid)">
            <v-col cols="6" md="6" lg="6" class="py-0">
              <!-- <div :class="{ 'my-text-style': substation.lineid===1}"> -->
                <div v-bind:style="
                 substation.stationcolor===0 ? 'color: red;' : 'color: green;' ">
                {{ substation.name }}
                <DeleteSubstation :substation="substation" />
                <UpdateSubstation :substation="substation" :lineid="selectedLine.id"/>
              </div>
            </v-col>
            <v-col cols="6" md="6" lg="6" class="py-0">
              <v-row :key="process._id" v-for="process in processes
              .filter((p) => substation.id === p.substationid)">
                <v-col cols="12" md="12" lg="12" class="py-0">
                <div>{{ process.name }}
                  <DeleteProcess :process="process" />
                  <UpdateProcess :process="process" />
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
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import socketioclient from 'socket.io-client';
import AddSubline from '../Components/AddSubline.vue';
import AddStation from '../Components/AddStation.vue';
import AddSubstation from '../Components/AddSubstation.vue';
import AddProcess from '../Components/AddProcess.vue';
import UpdateSubline from '../Components/UpdateSubline.vue';
import UpdateSubstation from '../Components/UpdateSubstation.vue';
import UpdateStation from '../Components/UpdateStation.vue';
import UpdateProcess from '../Components/UpdateProcess.vue';
import DeleteSubline from '../Components/DeleteSubline.vue';
import DeleteStation from '../Components/DeleteStation.vue';
import DeleteSubstation from '../Components/DeleteSubstation.vue';
import DeleteProcess from '../Components/DeleteProcess.vue';
import SelectedLineUpdate from '../Components/SelectedLineUpdate.vue';

export default {
  name: 'ProductionLayout',
  components: {
    AddSubline,
    AddStation,
    AddSubstation,
    AddProcess,
    UpdateSubline,
    UpdateStation,
    UpdateSubstation,
    UpdateProcess,
    DeleteSubline,
    DeleteStation,
    DeleteSubstation,
    DeleteProcess,
    SelectedLineUpdate,
  },
  data() {
    return {
      interval: null,
      dialog: false,
      isActive: 2,
      hasError: 4,
      headersProductionLayout: [
        {
          text: 'Subline',
          value: 'subline',
        },
        {
          text: 'Station',
          value: 'station',
        },
        {
          text: 'Sub-station',
          value: 'substation',
        },
        {
          text: 'Process',
          value: 'process',
        },
      ],
      loading: false,
      selectedLine: null,
      selectedStation: null,
    };
  },
  computed: {
    ...mapState('productionLayout', ['lines', 'subStations', 'stations', 'sublines', 'processes']),
  },
  async created() {
    const success = await this.getLines();
    if (success) {
      [this.selectedLine] = this.lines;
      await this.onLineChange();
    }
    this.interval = setInterval(() => {
      this.downloadFromToPLC();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    ...mapActions('productionLayout', ['getLines',
      'getSubStations',
      'getStations',
      'getSublines',
      'getProcesses',
      'downloadToPLC']),
    ...mapMutations('productionLayout', [
      'setSublines',
      'setStations',
      'setSubStations',
      'setProcesses',
      'setSelectedLine',
    ]),
    async downloadFromToPLC() {
      this.socket = socketioclient.connect('http://:10190');
      this.socket.on('connect', () => {
      });
      let ObJ;
      this.subStations.forEach(async (item) => {
        ObJ = {
          lineid: item.lineid,
          sublineid: item.sublineid,
          substationid: item.id,
        };
        this.socket.on(`update_parameter_${ObJ.lineid}_${ObJ.sublineid}_${ObJ.substationid}`,
          (data) => {
            console.log(data);
            if (data.communicationerror) {
              item.stationcolor = 0;
            } else {
              item.stationcolor = 1;
            }
          });
        await this.downloadToPLC(ObJ);
      });
    },
    setStation(station) {
      this.selectedStation = station;
    },
    async onLineChange() {
      this.setSublines([]);
      this.setStations([]);
      this.setProcesses([]);
      this.setSubStations([]);
      await this.getSublines(`?query=lineid==${this.selectedLine.id}`);
      await this.getStations('');
      await this.getSubStations('');
      await this.getProcesses('');
      this.setSelectedLine(this.selectedLine);
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
