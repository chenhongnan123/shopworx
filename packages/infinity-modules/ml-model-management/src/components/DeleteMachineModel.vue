<template>
  <v-dialog v-model="dialog" max-width="290">
    <template v-slot:activator="{ on }">
      <v-icon
        style="margin-top: -47px; margin-right: 23px"
        v-on="on"
        v-text="'$delete'"
        class="float-right"
        color="error"
      ></v-icon>
    </template>
    <v-card>
      <v-card-title class="headline"
        >Delete Files?
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" @click="onBtnClick">
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
      dialog: false,
    };
  },
  props: {
    payload: {
      required: true,
    },
    selectedmodel: {
      required: true,
    },
  },
  computed: {
    ...mapState('modelManagement', ['processModelList']),
  },
  methods: {
    ...mapActions('modelManagement', ['deleteFileById', 'getModelRecords', 'getInputRecords', 'getOutputRecords', 'getModelFiles']),
    ...mapMutations('helper', ['setAlert']),
    async onBtnClick() {
      let deleted = false;
      console.log(this.payload);
      deleted = await this.deleteFileById(this.payload._id);
      if (deleted) {
        // await this.getModelRecords(`?query=lineid==${this.payload.
        // lineid}%26%26stationid=="${this.payload.stationid}"
        //   %26%26processid=="${this.payload.processid}"`);
        await this.getModelRecords(`?query=lineid==${this.payload.lineid}%26%26stationid=="${this.payload.stationid}"%26%26subprocessid=="${this.payload.subprocessid}"`);
        // add new logic
        this.processModelList.forEach(async (model) => {
          model.inputlist = await this.getInputRecords(`?query=lineid==${this.payload.lineid}%26%26stationid=="${this.payload.stationid}"
          %26%26subprocessid=="${this.payload.subprocessid}"%26%26modelid=="${this.selectedmodel._id}"`);
          model.outputlist = await this.getOutputRecords(`?query=lineid==${this.payload.lineid}%26%26stationid=="${this.payload.stationid}"
          %26%26subprocessid=="${this.payload.subprocessid}"%26%26modelid=="${this.selectedmodel._id}"`);
          model.filelist = await this.getModelFiles(`?query=lineid==${this.payload.lineid}%26%26stationid=="${this.payload.stationid}"
          %26%26subprocessid=="${this.payload.subprocessid}"%26%26modelid=="${this.selectedmodel._id}"`);
        });
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MODEL_DELETE',
        });
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_DELETE_MODEL',
        });
      }
      this.dialog = false;
    },
  },
};
</script>
