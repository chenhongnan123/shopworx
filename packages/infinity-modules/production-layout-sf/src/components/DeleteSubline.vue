<template>
  <v-dialog v-model="dialog" max-width="290">
    <template #activator="{ on }">
      <v-icon v-on="on" v-text="'$delete'" class="float-right" color="error"></v-icon>
    </template>
    <v-card>
      <v-card-title class="headline"
        >Delete Subline?
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <span class="red--text">
          while deleting this Subline Coresponding Order and Roadmap also Deleted
        </span>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" @click="btnDeleteSubline" :loading="deleting">
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
      assetid: 0,
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
  },
  computed: {
    ...mapState('productionLayoutSF', ['runningOrderList', 'roadMapDetailsRecord']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLayoutSF', ['deleteSubline', 'inactiveElement']),
    async btnDeleteSubline() {
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
