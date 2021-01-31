<template>
  <!-- eslint-disable max-len -->
  <v-dialog persistent scrollable v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Parameter Configuration
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 800px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete clearable label="Parameter*" :items="processParameter" return-object :disabled="saving" item-text="name" prepend-icon="$production" @change="handleParameterClick" :rules="rules.parameter">
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field :disabled="saving" :rules="rules.usl" label="USL*" prepend-icon="mdi-tray-plus" v-model="parameterConfigObj.usl"></v-text-field>
          <v-text-field :disabled="saving" :rules="rules.lsl" label="LSL*" prepend-icon="mdi-tray-plus" v-model="parameterConfigObj.lsl"></v-text-field>
          <v-text-field :disabled="saving" :rules="rules.max" label="Max*" prepend-icon="mdi-tray-plus" v-model="parameterConfigObj.max"></v-text-field>
          <v-text-field :disabled="saving" :rules="rules.min" label="Min*" prepend-icon="mdi-tray-plus" v-model="parameterConfigObj.min"></v-text-field>
          <v-text-field :disabled="saving" :rules="rules.target" label="Target*" prepend-icon="mdi-tray-plus" v-model="parameterConfigObj.target"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="text-none" :loading="saving" @click="saveParameter">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';

export default {
  data() {
    return {
      saving: false,
      parameterConfigObj: {
        lineid: null,
        sublineid: null,
        stationid: null,
        substationid: null,
        parameterid: null,
        parametername: null,
        parameterdescription: null,
        target: null,
        usl: null,
        lsl: null,
        max: null,
        min: null,
      },
      valid: true,
      isSaveValid: false,
      rules: {
        parameter: [(v) => !!v || 'Parameter is required'],
        target: [(v) => !!v || 'Target is required', (v) => v > 0 || 'Target is greater than zero'],
        usl: [(v) => !!v || 'USL is required', (v) => v > 0 || 'USL is greater than zero'],
        lsl: [(v) => !!v || 'LSL is required', (v) => v > 0 || 'LSL is greater than zero'],
        max: [(v) => !!v || 'Max is required', (v) => v > 0 || 'Max is greater than zero'],
        min: [(v) => !!v || 'Min is required', (v) => v > 0 || 'Min is greater than zero'],
      },
      boolList: [
        { name: 'Yes', id: 1 },
        { name: 'No', id: 0 },
      ],
      protocolList: [{ name: 'SNAP7', id: 'SNAP7' }],
    };
  },
  props: ['station', 'substation', 'line', 'subline'],
  computed: {
    ...mapState('spc', ['addParameterDialog', 'directionList', 'categoryList', 'datatypeList', 'parameterList', 'parameteranalysisList', 'selectedParameterName', 'selectedParameterDirection', 'selectedParameterCategory', 'selectedParameterDatatype', 'stationList']),
    dialog: {
      get() {
        return this.addParameterDialog;
      },
      set(val) {
        this.setAddParameterDialog(val);
      },
    },
    processParameter: {
      get() {
        return this.parameterList.filter((item) => item.parametercategory === '15');
      },
    },
  },
  watch: {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('spc', ['setAddParameterDialog']),
    ...mapActions('spc', ['getPageDataList', 'createParameter', 'createParameteranalysis', 'getParameteranalysisListRecords', 'getSubStationIdElement', 'createTagElement']),
    getQuery() {
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `parametername=="${this.selectedParameterName}"%26%26`;
      }
      query += `substationid=="${this.substation || null}"`;
      return query;
    },
    async saveParameter() {
      const { parameterConfigObj } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        if (this.parameteranalysisList.some((parameter) => parameterConfigObj.parametername === parameter.parametername)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter configuration is present',
          });
          return;
        }

        const payload = {
          ...parameterConfigObj,
          assetid: 4,
        };
        this.saving = true;
        const parameterList = await this.createParameteranalysis(payload);
        this.saving = false;
        // eslint-disable-next-line max-len
        if (parameterList) {
          this.getParameteranalysisListRecords(this.getQuery());
          Object.keys(this.parameterConfigObj).forEach((k) => {
            this.parameterConfigObj[k] = '';
          });
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_PARAMETER',
          });
        }
        this.dialog = false;
      }
    },
    handleParameterClick(item) {
      if (item) {
        this.parameterConfigObj.parameterid = item.id;
        this.parameterConfigObj.parametername = item.name;
        this.parameterConfigObj.parameterdescription = item.description;
        this.parameterConfigObj.lineid = item.lineid;
        this.parameterConfigObj.sublineid = item.sublineid;
        this.parameterConfigObj.stationid = item.stationid;
        this.parameterConfigObj.substationid = item.substationid;
      }
    },
  },
};
</script>
