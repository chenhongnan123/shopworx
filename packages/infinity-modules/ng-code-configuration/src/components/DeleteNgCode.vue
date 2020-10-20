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
        <v-card-title class="headline">Alert!
           <v-spacer></v-spacer>
           <v-btn icon small @click="dialog = false">
           <v-icon>mdi-close</v-icon>
           </v-btn>
        </v-card-title>

        <v-card-text>
        Do you really want to Delete this NG CODE Record?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            @click="btnDeleteNgCodeConfig(item)"
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
      ngcode: {},
      // assetId: 4,
      default: false,
      dialog: false,
      deleting: false,
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  created() {
  },
  computed: {
    ...mapState('ngCodeConfiguration', ['ngCodeConfigRecord']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('ngCodeConfiguration', ['deleteNgCode']),
    async btnDeleteNgCodeConfig(item) {
      this.itemForDelete = item;
      const deleted = await this.deleteNgCode(this.itemForDelete._id);
      if (deleted) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'NG_CODE_CONFIG_DELETED',
        });
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETING_NG_CODE',
        });
      }
      this.dialog = false;
    },
  },
};
</script>
