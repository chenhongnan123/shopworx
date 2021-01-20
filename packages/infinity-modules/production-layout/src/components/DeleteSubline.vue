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
        <v-card-title class="headline">Delete Subline?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
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
    ...mapActions('productionLayout', ['deleteSubline', 'getRunningOrder', 'getRoadMapDetailsRecord', 'getSubStationIdElement', 'getSubStations', 'inactiveElement', 'inactiveRealElement', 'inactiveProcessElement']),
    async btnDeleteSubline() {
      const getSubStation = this.subStations
        .filter((s) => s.sublineid === this.subline.id);
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
      const sublineObject = {
        id: this.subline.id,
        lineid: this.subline.lineid,
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
    },
  },
};
</script>
