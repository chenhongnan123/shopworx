<template>
  <v-container fluid class="py-0">
    <v-row justify="center">
      <v-col cols="12" xl="10" class="py-0">
        <portal to="app-header">Production Layout</portal>
        <v-row>
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
            <v-col cols="2" md="2" lg="2">
              <v-text-field
                label="IP Address"
                v-model="selectedLine.ipaddr"
              ></v-text-field>
            </v-col>
            <v-col cols="2" md="2" lg="2">
              <v-text-field
                label="Host Name"
                v-model="selectedLine.hostname"
              ></v-text-field>
            </v-col>
          </template>
        </v-row>
        <v-row class="mb-6" no-gutters>
          <div style="float:right">
          <v-spacer></v-spacer>
           <SelectedLineUpdate />
           <AddLine />
           <v-btn
            small
            color="primary"
            outlined
            class="text-none ml-2"
            @click="toggleFilter"
            >
              <v-icon small left>mdi-filter-variant</v-icon>
              Filters
            </v-btn>
            <ProductionFilter />
          </div>
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
                  <span class="ml-0">Sub-Process</span>
                  <AddProcess />
                  </v-card>
                </v-col>
           </v-row>
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
                <div>
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
import AddSubline from '../components/AddSubline.vue';
import AddStation from '../components/AddStation.vue';
import AddSubstation from '../components/AddSubstation.vue';
import AddProcess from '../components/AddProcess.vue';
import AddLine from '../components/AddLine.vue';
import UpdateSubline from '../components/UpdateSubline.vue';
import UpdateSubstation from '../components/UpdateSubstation.vue';
import UpdateStation from '../components/UpdateStation.vue';
import UpdateProcess from '../components/UpdateProcess.vue';
import DeleteSubline from '../components/DeleteSubline.vue';
import DeleteStation from '../components/DeleteStation.vue';
import DeleteSubstation from '../components/DeleteSubstation.vue';
import DeleteProcess from '../components/DeleteProcess.vue';
import SelectedLineUpdate from '../components/SelectedLineUpdate.vue';
import ProductionFilter from '../components/ProductionFilter.vue';

export default {
  name: 'ProductionLayout',
  components: {
    AddLine,
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
    ProductionFilter,
  },
  data() {
    return {
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
      'toggleFilter',
    ]),
    async downloadFromToPLC() {
      this.socket = socketioclient.connect('http://:10190');
      this.socket.on('connect', () => {
      });
      let ObJ;
      this.subStations.forEach((item) => {
        ObJ = {
          lineid: item.lineid,
          sublineid: item.sublineid,
          substationid: item.id,
        };
        this.socket.on(`update_parameter_${ObJ.lineid}_${ObJ.sublineid}_${ObJ.substationid}`,
          (data) => {
            if (data) {
              this.substation.stationcolor = 1;
            } else {
              this.substation.stationcolor = 0;
            }
          });
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
