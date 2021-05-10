<template>
  <v-dialog v-model="dialog" max-width="300">
    <template #activator="{ on }">
      <v-icon v-on="on" v-text="'$delete'" class="float-right" color="error"></v-icon>
    </template>
    <v-card>
      <v-card-title class="headline"
        >Delete Machine?
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <span class="red--text">
          Are you confirm deleting this Machine ?
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" @click="btnDeleteMachine" :loading="deleting">
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
      assetid: 0,
      default: false,
      dialog: false,
      deleting: false,
    };
  },
  props: {
    machine: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.getRoadMapDetailsRecord();
    this.getRunningOrder();
  },
  computed: {
    ...mapState('productionLayoutSF', ['runningOrderList', 'roadMapDetailsRecord']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutSF', [
      'deleteMachine',
      'getRunningOrder',
      'getRoadMapDetailsRecord',
      'inactiveElement',
    ]),
    async btnDeleteMachine() {
      let deleted = false;
      this.deleting = true;
      deleted = await this.deleteMachine(this.machine);
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
    },
  },
};
</script>
