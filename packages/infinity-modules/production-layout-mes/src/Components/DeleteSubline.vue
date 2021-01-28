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
        <v-card-title class="headline">Delete Subline?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        <!-- Do you really want to Delete this Subline? -->
        <span class="red--text">
          while deleting this
          Subline Coresponding Order and Roadmap also Deleted
        </span>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteSubline"
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
      newSubLine: {},
      assetId: 4,
      deleting: false,
      default: false,
      dialog: false,
    };
  },
  props: {
    subline: {
      type: Object,
      required: true,
    },
  },
  created() {
    // this.getRunningOrder('?orderstatus=Running');
    this.getRoadMapDetailsRecord();
    // this.getOrder('?query=orderstatus!="Running"');
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
    ...mapActions('productionLayoutMes', ['deleteSubline', 'getRunningOrder', 'getRoadMapDetailsRecord', 'getSubStationIdElement', 'getSubStations', 'inactiveElement']),
    async btnDeleteSubline() {
      await this.getRunningOrder();
      const getroadMapId = this.runningOrderList.map((rmi) => rmi.roadmapid);
      const roadmapList = this.roadMapDetailsRecord
        .filter((rm) => rm.roadmapid === getroadMapId[0]);
      const compareStation = roadmapList
        .filter((s) => s.sublineid === this.subline.id);
      if (compareStation.length > 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ONE_STATION_BIND_RUNNING_ORDER',
        });
        this.dialog = false;
      } else {
        // get plc parameter
        const getSubStation = this.subStations
          .filter((s) => s.sublineid === this.subline.id);
        const matchSubStation = getSubStation.forEach(async (item) => {
          const element = await this.getSubStationIdElement(item.id);
          const eleList = await this.inactiveElement(
            {
              elementId: element.id,
              status: 'INACTIVE',
            },
          );
          console.log(eleList);
        });
        await Promise.all([matchSubStation]);
        const gotRoadmap = this.roadMapDetailsRecord
          .filter((s) => s.sublineid === this.subline.id);
        if (gotRoadmap.length > 0) {
          const deleteRoadmapId = gotRoadmap[0].roadmapid;
          const sublineObject = {
            id: this.subline.id,
            lineid: this.subline.lineid,
            roadmapid: deleteRoadmapId,
          };
          this.deleting = true;
          let deleted = false;
          deleted = await this.deleteSubline(sublineObject);
          if (deleted) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'SUBLINE_DEPENDANT_DELETED',
            });
            this.deleting = false;
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_DELETING_SUBLINE',
            });
          }
        } else {
          const defaultRoadmId = 'roadmap-00';
          const sublineObject = {
            id: this.subline.id,
            lineid: this.subline.lineid,
            roadmapid: defaultRoadmId,
          };
          this.deleting = true;
          let deleted = false;
          deleted = await this.deleteSubline(sublineObject);
          if (deleted) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'SUBLINE_DELETED',
            });
            this.deleting = false;
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_DELETING_SUBLINE',
            });
          }
          this.dialog = false;
        }
      }
    },
  },
};
</script>
