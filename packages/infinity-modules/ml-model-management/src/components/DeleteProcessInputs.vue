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
        >Delete this Input?
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
      paramterSelected: [],
    };
  },
  props: {
    payload: {
      required: true,
    },
  },
  computed: {
    ...mapState('modelManagement', [
      'processIntputList',
      'processModelList',
      'selectedParameterList',
    ]),
    ...mapState('parameterConfiguration', ['parameterList', 'categoryList']),
  },
  methods: {
    ...mapActions('modelManagement', ['deleteInput', 'getInputRecords']),
    ...mapActions('parameterConfiguration', [
      'getPageDataList',
      'getParameterListRecords',
    ]),
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('modelManagement', ['setSelectedParameterList']),
    async onBtnClick() {
      let deleted = false;
      console.log(this.payload);
      deleted = await this.deleteInput(this.payload._id);
      if (deleted) {
        await this.getParameterListRecords('?pagenumber=1&pagesize=10');
        this.parameterList.forEach((parameter) => {
          if (parameter.parametercategory === 51) {
            this.paramterSelected.push(parameter);
          }
        });
        this.paramterSelected = this.paramterSelected.sort((a, b) => b.description - a.description);
        console.log(this.paramterSelected);
        // this.setParameterList(this.parameterList);
        await this.getInputRecords(`?query=lineid==${this.payload.lineid}%26%26stationid=="${this.payload.stationid}"
          %26%26processid=="${this.payload.processid}"`);
        this.processIntputList.forEach((f) => {
          const usedObject = this.paramterSelected.find((p) => p.id === f.parameterid);
          this.paramterSelected.splice(this.paramterSelected.indexOf(usedObject), 1);
        });
        console.log(this.paramterSelected);
        this.setSelectedParameterList(this.paramterSelected);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'INPUT_PROCESS_DELETED',
        });
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_INPUT_PROCESS',
        });
      }
      this.dialog = false;
    },
  },
};
</script>
