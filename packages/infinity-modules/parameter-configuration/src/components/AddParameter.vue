<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Parameter
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <v-card-text style="height: 800px;">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
              :disabled="saving"
              :rules="rules.name"
              label="Parameter Name"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.name"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.id"
              label="Parameter ID"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.id"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.description"
              label="Parameter Description"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.description"
          ></v-text-field>
           <v-autocomplete
            clearable
            label="Direction"
            :items="directionList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="$production"
            v-model="parameterObj.parameterdirection"
            :rules="rules.parameterdirection"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            label="Category"
            :items="categoryList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="$production"
            v-model="parameterObj.parametercategory"
            :rules="rules.parametercategory"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            label="Date type"
            :items="datatypeList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="$production"
            v-model="parameterObj.datatype"
            :rules="rules.datatype"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
              :disabled="saving"
              label="DB Address"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.dbaddress"
              :rules="rules.dbaddress"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              label="Start address"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.startaddress"
              :rules="rules.startaddress"
              type="number"
          ></v-text-field>
          <v-autocomplete
            clearable
            label="Protocol"
            :items="protocolList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="$production"
            v-model="parameterObj.protocol"
            :rules="rules.protocol"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            label="Is Conversion"
            :items="boolList"
            return-object
            :disabled="saving"
            item-text="name"
            prepend-icon="$production"
            v-model="parameterObj.isconversion"
            :rules="rules.isconversion"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
              :disabled="saving"
              :rules="rules.multiplicationfactor"
              label="Multiplication Factor"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.multiplicationfactor"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.divisionfactor"
              label="Division Factor"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.divisionfactor"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.currentvalue"
              label="Parameter Current Value"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.currentvalue"
          ></v-text-field>
          <v-text-field
              :disabled="saving"
              :rules="rules.parameterunit"
              label="Parameter Unit"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.parameterunit"
          ></v-text-field>
        </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="Object.keys(parameterObj).some((k) => !parameterObj[k]) || saving"
            @click="saveParameter"
          >
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
      parameterObj: {
        name: null,
        id: null,
        description: null,
        parameterdirection: null,
        parametercategory: null,
        datatype: null,
        dbaddress: null,
        startaddress: null,
        protocol: null,
        isconversion: null,
        multiplicationfactor: null,
        divisionfactor: null,
        currentvalue: null,
        parameterunit: null,
      },
      valid: true,
      isSaveValid: false,
      rules: {
        name: [
          (v) => !!v || 'Parameter Name is required',
        ],
        id: [
          (v) => !!v || 'Parameter ID is required',
        ],
        description: [
          (v) => !!v || 'Parameter Description is required',
        ],
        parameterdirection: [
          (v) => !!v || 'Direction is required',
        ],
        parametercategory: [
          (v) => !!v || 'Category is required',
        ],
        datatype: [
          (v) => !!v || 'Data Type is required',
        ],
        dbaddress: [
          (v) => !!v || 'DB ADdress is required',
        ],
        startaddress: [
          (v) => !!v || 'Start Adress is required',
          (v) => v % 1 === 0 || 'Start ADdress is Integer',
        ],
        protocol: [
          (v) => !!v || 'Protocol is required',
        ],
        size: [
          (v) => !!v || 'Size is required',
          (v) => v % 1 === 0 || 'Size is Integer',
          (v) => v > 0 || 'Size is greater than zero',
        ],
        isconversion: [
          (v) => !!v || 'Is Conversion is required',
        ],
        multiplicationfactor: [
          (v) => !!v || 'Multiplication Factor is required',
          (v) => v % 1 === 0 || 'Multiplication Factor is Integer',
        ],
        divisionfactor: [
          (v) => !!v || 'Division Factor is required',
          (v) => v % 1 === 0 || 'Division Factor is Integer',
        ],
        currentvalue: [
          (v) => !!v || 'Parameter Current Value',
        ],
        parameterunit: [
          (v) => !!v || 'Parameter Unit',
        ],
      },
      boolList: [
        { name: 'Yes', id: 1 },
        { name: 'No', id: 0 },
      ],
      protocolList: [
        { name: 'SNAP7', id: 'SNAP7' },
      ],
    };
  },
  props: ['station', 'substation', 'line', 'subline'],
  computed: {
    ...mapState('parameterConfiguration', ['addParameterDialog', 'directionList', 'categoryList', 'datatypeList', 'parameterList', 'selectedParameterName', 'selectedParameterDirection', 'selectedParameterCategory', 'selectedParameterDatatype']),
    dialog: {
      get() {
        return this.addParameterDialog;
      },
      set(val) {
        this.setAddParameterDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('parameterConfiguration', ['setAddParameterDialog']),
    ...mapActions('parameterConfiguration', ['getPageDataList', 'createParameter', 'getParameterListRecords']),
    getQuery() {
      let query = '?query=';
      if (this.selectedParameterName) {
        query += `name=="${this.selectedParameterName}"%26%26`;
      }
      if (this.selectedParameterDirection) {
        query += `parameterdirection=="${this.selectedParameterDirection}"%26%26`;
      }
      if (this.selectedParameterCategory) {
        query += `parametercategory=="${this.selectedParameterCategory}"%26%26`;
      }
      if (this.selectedParameterDatatype) {
        query += `datatype=="${this.selectedParameterDatatype}"%26%26`;
      }
      query += `substationid=="${this.substation || null}"`;
      return query;
    },
    async saveParameter() {
      const { parameterObj } = this;
      if (this.$refs.form.validate()) {
        const { name, dbaddress, startaddress } = parameterObj;
        if (this.parameterList.some((parameter) => name === parameter.name)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter name is present',
          });
          return;
        }
        if (this.parameterList
          .some((parameter) => dbaddress === parameter.dbaddress
          && startaddress === parameter.startaddress)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter startaddress is present',
          });
          return;
        }
        if (parameterObj.datatype && parameterObj.datatype.name === 'Boolean' && parameterObj.size > 8) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter size is less than 9',
          });
          return;
        }
        const payload = {
          ...parameterObj,
          assetid: 4,
          parameterdirection: parameterObj.parameterdirection.id,
          parametercategory: parameterObj.parametercategory.id,
          datatype: parameterObj.datatype.id,
          isbigendian: parameterObj.datatype.isbigendian,
          isswapped: parameterObj.datatype.isswapped,
          isconversion: parameterObj.isconversion.id,
          protocol: parameterObj.protocol.id,
          startaddress: Number(parameterObj.startaddress),
          size: Number(parameterObj.datatype.size),
          lineid: this.line,
          sublineid: this.subline,
          stationid: this.station,
          substationid: this.substation,
        };
        if (payload.datatype === 'Boolean' || payload.datatype === 'String') {
          payload.size = parameterObj.size;
        }
        this.saving = true;
        const parameterList = await this.createParameter(payload);
        this.saving = false;
        if (parameterList) {
          this.getParameterListRecords(this.getQuery());
          Object.keys(this.parameterObj).forEach((k) => {
            this.parameterObj[k] = '';
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
  },
};
</script>