<template>
  <!-- eslint-disable max-len -->
  <v-dialog persistent scrollable v-model="dialog" max-width="500px" transition="dialog-transition">
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Parameter Analysis
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 350px;">
        <v-form ref="form" v-model="valid" lazy-validation>
           <v-autocomplete class="mt-5" :items="elementList" :rules="rules.element" outlined  hide-details v-model="element" name="name" label="Select Element" item-text="elementDescription" return-object clearable>
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.elementName"></v-list-item-title>
                <v-list-item-subtitle v-text="item.elementDescription"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete class="mt-5" v-if="element" :items="tags" :rules="rules.element" outlined  hide-details v-model="tag" name="name" label="Select Tag" item-text="tagDescription" return-object  clearable>
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.tagName"></v-list-item-title>
                <v-list-item-subtitle v-text="item.tagDescription"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field class="mt-5" :disabled="saving" :rules="rules.ucl" outlined hide-details label="UCL*" type="number" v-model="parameterConfigObj.ucl"></v-text-field>
          <v-text-field class="mt-5" :disabled="saving" :rules="rules.lcl" outlined hide-details label="LCL*" type="number" v-model="parameterConfigObj.lcl"></v-text-field>
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
      element: null,
      tag: null,
      saving: false,
      parameterConfigObj: {
        ucl: null,
        lcl: null,
      },
      valid: true,
      isSaveValid: false,
      rules: {
        element: [(v) => !!v || 'Parameter is required'],
        ucl: [(v) => !!v || 'USL is required'],
        lcl: [(v) => !!v || 'LCL is required'],
      },
      boolList: [
        { name: 'Yes', id: 1 },
        { name: 'No', id: 0 },
      ],
    };
  },
  computed: {
    ...mapState('masters', ['elements']),
    ...mapState('spc', ['addParameterDialog', 'spcconfigurationList']),
    dialog: {
      get() {
        return this.addParameterDialog;
      },
      set(val) {
        this.setAddParameterDialog(val);
      },
    },
    elementList() {
      // eslint-disable-next-line
      return this.elements.map((element) => {
        return {
          ...element.element,
          tags: element.tags,
        };
      });
    },
    tags() {
      if (this.element) {
        return this.element.tags.filter((tag) => tag.emgTagType === 'Int' || tag.emgTagType === 'Double' || tag.emgTagType === 'Float');
      }
      return [];
    },
  },
  watch: {},
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('spc', ['setAddParameterDialog']),
    ...mapActions('spc', ['getPageDataList', 'createParameter', 'createSpcconfiguration', 'getSpcconfigurationListRecords', 'getSubStationIdElement', 'createTagElement']),
    getQuery() {
      let query = '?query=';
      if (this.elementValue) {
        query += `elementName=="${this.elementValue}"`;
      }
      return query;
    },
    async saveParameter() {
      const { parameterConfigObj, tag, element } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        if (this.spcconfigurationList.some((parameter) => parameterConfigObj.elementname === parameter.elementname)) {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'parameter configuration is present',
          });
          return;
        }

        const payload = {
          ...parameterConfigObj,
          tagname: tag.tagName,
          tagdescription: tag.tagDescription,
          elementname: element.elementName,
          elementdescription: element.elementDescription,
          assetid: 4,
        };
        this.saving = true;
        const parameterList = await this.createSpcconfiguration(payload);
        this.saving = false;
        // eslint-disable-next-line max-len
        if (parameterList) {
          this.getSpcconfigurationListRecords(this.getQuery());
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
