<template>
  <v-card flat>
    <v-card-text class="pt-0">
      <v-autocomplete
          v-model="parameterList"
          :items="criticalParameters"
          filled
          class="ma-0 pa-0"
          chips
          color="primary"
          label="Select"
          item-text="name"
          item-value="parameterId"
          hide-details
          @change="onChange()"
          @input="searchInput=null"
          :search-input.sync="searchInput"
        >
        <template v-slot:selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            color="primary"
          >
            {{ data.item.name }}
          </v-chip>
          </template>
            <template v-slot:item="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-item-content v-text="data.item"></v-list-item-content>
              </template>
              <template v-else>
                <v-list-item-content>
                <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
       <v-row
        class="mt-4"
        no-gutters
      >
      <v-col cols="4" md="4" lg="4">
      <v-text-field
        dense
        outlined
        v-model="maxlimit"
        type="number"
        label="Maxinum limit*"
      ></v-text-field>
      </v-col>
      <v-col cols="4" md="4" lg="4">
      <v-text-field
        class="ml-2"
        dense
        outlined
        v-model="minlimit"
        type="number"
        label="Minimum limit*"
      ></v-text-field>
      </v-col>
      <v-col cols="4" md="4" lg="4" align="center">
      <v-btn
        small
        color="primary"
        class="text-none"
        @click="AddCriticalParameter"
      >
        <v-icon left small>mdi-plus</v-icon>
        Add
      </v-btn>
      </v-col>
      </v-row>
      <v-data-table
        :headers="headers"
        :items="modelCriticals"
        item-key="modelid"
        >
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-btn
              icon
              small
              color="error"
              @click="remove(item)"
              :loading="deleting"
            >
              <v-icon v-text="'$delete'"></v-icon>
            </v-btn></v-row>
        </template>
      </v-data-table>
      <span></span>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'modelCriticals',
  props: {
    modelDetails: {
      type: Object,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      searchInput: null,
      maxlimit: 0,
      minlimit: 0,
      headers: [
        {
          text: 'Parameter name',
          value: 'parameterName',
        },
        {
          text: 'Max limit',
          value: 'maxLimit',
        },
        {
          text: 'Min limit',
          value: 'minLimit',
        },
        {
          text: 'Action',
          value: 'actions',
        },
      ],
    };
  },
  computed: {
    ...mapState('modelManagement', ['criticalParameters']),
    modelCriticals() {
      return this.modelDetails && this.modelDetails.modelCriticals;
    },
    // parameterList: {
    //   get() {
    //     return this.modelCriticals;
    //   },
    //   set(val) {
    //     this.saveInputParam(val);
    //   },
    // },
  },
  created() {
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('modelManagement', [
      'createCriticalParameter',
      'deleteCriticalParameter',
      'fetchModelDetails',
    ]),
    onChange() {
      // this.parameterList = this.modelInputs;
    },
    async remove(item) {
      const deleted = await this.deleteCriticalParameter(item.id);
      if (deleted) {
        await this.fetchModelDetails(this.model.modelid);
      }
    },
    AddCriticalParameter() {
      this.saveInputParam(this.parameterList);
    },
    async saveInputParam(param) {
      await Promise.all(this.modelCriticals.map(async (element) => {
        if (element.parameterId === param) {
          await this.deleteCriticalParameter(element.id);
        }
      }));
      if (this.maxlimit === 0 || this.minlimit === 0) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FIELDS_EMPTY',
        });
      } else {
        const object = param;
        if (object) {
          await this.createCriticalParameter({
            modelId: this.model.modelid,
            maxLimit: this.maxlimit,
            minLimit: this.minlimit,
            parameterId: object,
            parameterName: this.criticalParameters.find((f) => f.parameterId === object).name,
          });
        }
      }
      await this.fetchModelDetails(this.model.modelid);
    },
    async updateInputParameter(param) {
      if (param.selected) {
        await this.createCriticalParameter({
          modelId: this.model.modelid,
          maxLimit: this.maxlimit,
          minLimit: this.minlimit,
          parameterId: param.id,
        });
      } else {
        const modelInputId = this.modelCriticals
          .find((input) => input.parameterId === param.id)
          .id;
        this.deleteCriticalParameter(modelInputId);
      }
    },
  },
};
</script>
