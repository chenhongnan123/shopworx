<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template #activator="{ on }">
    <v-icon v-on="on" v-text="'$delete'"
    class="float-right" color="error"></v-icon>
    </template>
      <v-card>
        <v-card-title class="headline">Delete Station?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        <span class="red--text">
          while deleting this
          Station Coresponding Order and Roadmap also Deleted
        </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteStation"
            :loading="deleting"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  data() {
    return {
      plan: {},
      assetId: 4,
      default: false,
      dialog: false,
      deleting: false,
    };
  },
  props: {
    station: {
      type: Object,
      required: true,
    },
    subline: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.getRoadMapDetailsRecord();
    this.getRunningOrder();
    this.getSubStations();
  },
  computed: {
    ...mapState('productionLayout', [
      'runningOrderList',
      'roadMapDetailsRecord',
      'subStations',
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['deleteStation', 'getRunningOrder', 'getRoadMapDetailsRecord', 'getSubStationIdElement', 'getSubStations', 'inactiveElement', 'inactiveRealElement', 'inactiveProcessElement']),
    async btnDeleteStation() {
      const getSubStation = this.subStations
        .filter((s) => s.stationid === this.station.id);
      const matchSubStation = getSubStation.forEach(async (item) => {
        const element = await this.getSubStationIdElement(item.id);
        const getRealElement = await this.getSubStationIdElement(`real_${item.id}`);
        const getProcessElement = await this.getSubStationIdElement(`process_${item.id}`);
        const process = {
          status: 'INACTIVE',
          // elementName: `process_${this.substation.id}`,
          elementId: getProcessElement.id,
        };
        const real = {
          status: 'INACTIVE',
          // elementName: `real_${this.substation.id}`,
          elementId: getRealElement.id,
        };
        const realPInactive = await this.inactiveRealElement(real);
        if (realPInactive) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'REAL_ELEMENT_INACTIVE',
          });
          this.deleting = false;
          this.dialog = false;
        }
        const processPInactive = await this.inactiveProcessElement(process);
        if (processPInactive) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'PROCESS_ELEMENT_INACTIVE',
          });
          this.deleting = false;
          this.dialog = false;
        }
        await this.inactiveElement(
          {
            elementId: element.id,
            status: 'INACTIVE',
          },
        );
      });
      await Promise.all([matchSubStation]);
      const sutationObject = {
        id: this.station.id,
        lineid: this.station.lineid,
        sublineid: this.station.sublineid,
      };
      let deleted = false;
      this.deleting = true;
      deleted = await this.deleteStation(sutationObject);
      if (deleted) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'STATION_DELETED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_STATION',
        });
      }
      this.dialog = false;
    },
  },
};
</script>
