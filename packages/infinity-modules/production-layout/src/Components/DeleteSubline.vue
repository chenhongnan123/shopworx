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
        Do you really want to Delete this Subline?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteSubline"
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
      newSubLine: {},
      assetId: 4,
      // myResult: [],
      // getLastInserTedData: [],
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
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayout', ['deleteSubline']),
    async btnDeleteSubline() {
      // const deleted = false;
      const sublineObject = {
        id: this.subline.id,
        lineid: this.subline.lineid,
      };
      await this.deleteSubline(sublineObject);
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
