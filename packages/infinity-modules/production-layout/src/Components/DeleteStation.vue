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
        Do you really want to Delete this Station?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteStation"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      plan: {},
      assetId: 4,
      default: false,
      dialog: false,
    };
  },
  props: {
    station: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['deleteStation']),
    async btnDeleteStation() {
      const sutationObject = {
        id: this.station.id,
        lineid: this.station.lineid,
        sublineid: this.station.sublineid,
      };
      let deleted = false;
      deleted = this.deleteStation(sutationObject);
      if (deleted) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'STATION_DELETED',
        });
        this.dialog = false;
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
