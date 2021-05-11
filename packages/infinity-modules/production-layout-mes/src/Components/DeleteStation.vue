<template>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{ on }">
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
        <!-- Do you really want to Delete this Station? -->
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
      required: false,
    },
  },
  created() {
    // this.getRunningOrder('?orderstatus=Running');
    this.getRoadMapDetailsRecord();
    // this.btnDeleteStation();
    this.getRunningOrder();
    this.getSubStations();
  },
  computed: {
    ...mapState('productionLayoutMes', [
      'runningOrderList',
      'roadMapDetailsRecord',
      'subStations',
    ]),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutMes', ['deleteStation', 'getRunningOrder', 'getRoadMapDetailsRecord', 'getSubStationIdElement', 'getSubStations', 'inactiveElement']),
    async btnDeleteStation() {
      await this.getRunningOrder();
      const getroadMapId = this.runningOrderList.map((rmi) => rmi.roadmapid);
      const roadmapList = this.roadMapDetailsRecord
        .filter((rm) => rm.roadmapid === getroadMapId[0]);
      const compareStation = roadmapList
        .filter((s) => s.stationid === this.station.id);
      if (compareStation.length > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'STATION_ASSIGN_RUNNING_ORDER',
        });
        this.dialog = false;
      } else {
        // get plc parameter
        // const getSubStation = this.subStations
        //   .filter((s) => s.stationid === this.station.id);
        // const matchSubStation = getSubStation.forEach(async (item) => {
        //   const element = await this.getSubStationIdElement(item.id);
        //   const eleList = await this.inactiveElement(
        //     {
        //       elementId: element.id,
        //       status: 'INACTIVE',
        //     },
        //   );
        //   // if (eleList) {
        //   //   this.setAlert({
        //   //     show: true,
        //   //     type: 'success',
        //   //     message: 'INACTIVE_PROCESS_ELEMENT',
        //   //   });
        //   // }
        // });
        // await Promise.all([matchSubStation]);
        const gotRoadmap = this.roadMapDetailsRecord
          .filter((s) => s.stationid === this.station.id);
        if (gotRoadmap.length > 0) {
          const deleteRoadmapId = gotRoadmap[0].roadmapid;
          const sutationObject = {
            id: this.station.id,
            lineid: this.station.lineid,
            sublineid: this.station.sublineid,
            roadmapid: deleteRoadmapId,
          };
          let deleted = false;
          this.deleting = true;
          deleted = await this.deleteStation(sutationObject);
          this.deleting = false;
          if (deleted) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'STATION_DEPENDANT_DELETED',
            });
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_DELETING_STATION',
            });
          }
        } else {
          const defaultRoadmId = 'roadmap-00';
          // const deleteRoadmapId;
          // deleteRoadmapId = deleteRoadmapId || defaultRoadmId;
          // deleteRoadmapId = defaultRoadmId;
          const sutationObject = {
            id: this.station.id,
            lineid: this.station.lineid,
            sublineid: this.station.sublineid,
            roadmapid: defaultRoadmId,
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
            this.deleting = false;
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_DELETING_STATION',
            });
          }
          this.dialog = false;
        }
      }
    },
  },
};
</script>
