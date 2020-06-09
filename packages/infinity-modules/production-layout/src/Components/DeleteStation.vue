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
      await this.deleteStation(this.station.id);
      // if (deleted) {
      //   this.setAlert({
      //     show: true,
      //     type: 'success',
      //     message: 'PROCESS_DELETED',
      //   });
      //   this.dialog = false;
      // } else {
      //   this.setAlert({
      //     show: true,
      //     type: 'error',
      //     message: 'ERROR_DELETING_PROCESS',
      //   });
      // }
      this.dialog = false;
    },
  },
};
</script>
