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
        <v-card-title class="headline">Delete Substation?
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Delete this Substation?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteSubstation"
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
      newSubstation: {},
      assetId: 4,
      default: false,
      dialog: false,
    };
  },
  props: {
    substation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['deleteSubstation']),
    async btnDeleteSubstation() {
      // const deleted = false;
      const subStationObject = {
        id: this.substation.id,
        sublineid: this.substation.sublineid,
        lineid: this.substation.lineid,
      };
      let deleted = false;
      deleted = this.deleteSubstation(subStationObject);
      if (deleted) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SUBSTATION_DELETED',
        });
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_SUBSTATION',
        });
      }
      this.dialog = false;
    },
  },
};
</script>
