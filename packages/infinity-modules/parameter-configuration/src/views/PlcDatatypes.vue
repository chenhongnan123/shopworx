<template>
  <v-container fluid class="py-0">
    <div justify="center" class="planScheduleView">
      <div class="py-0">
        <div class="stick">
          <v-toolbar
            flat
            dense
            :color="$vuetify.theme.dark ? '#121212': ''"
          >
            <v-spacer></v-spacer>
            <v-btn
            small
            color="primary"
            class="text-none"
            @click="dialog = true"
            >
              <v-icon small left>mdi-plus</v-icon>
              Add Datatype
            </v-btn>
            <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
              <v-icon small left>mdi-refresh</v-icon>
              Refresh
            </v-btn>
          </v-toolbar>
        </div>
        <v-data-table
        :headers="headers"
        item-key="_id"
        :items="dataTypeList"
        show-select
        >
        </v-data-table>
      </div>
    </div>
    <v-dialog
    persistent
    scrollable
    v-model="dialog"
    transition="dialog-transition"
    max-width="500px"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Create datatype
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
              label="Datatype"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.name"
          ></v-text-field>
          <v-text-field
              label="Datatype number"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.id"
          ></v-text-field>
          <v-text-field
              label="Size"
              prepend-icon="mdi-tray-plus"
              v-model="parameterObj.size"
          ></v-text-field>
        </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="saveDataType"
          >
            Save
          </v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex';

export default {
  name: 'PlanScheduleView',
  data() {
    return {
      headers: [
        { text: 'PLC', value: 'plc' },
        { text: 'Protocol', value: 'protocol' },
        { text: 'Data type', value: 'name' },
        { text: 'Data type number', value: 'id' },
        { text: 'Size', value: 'size' },
        { text: 'isBigendian', value: 'isbigendian' },
        { text: 'isSwapped', value: 'isswapped' },
      ],
      dialog: false,
      saving: false,
      parameterObj: {},
    };
  },
  async created() {
    await this.getDataTypes();
  },
  computed: {
    ...mapState('parameterConfiguration', ['dataTypeList']),
  },
  methods: {
    ...mapActions('parameterConfiguration', ['getDataTypes', 'addDataType']),
    async RefreshUI() {
      await this.getDataTypes();
    },
    saveDataType() {
      this.parameterObj = {
        ...this.parameterObj,
        isbigendian: 1,
        isswapped: 0,
        assetid: 4,
      };
      this.addDataType(this.parameterObj);
      this.dialog = false;
    },
  },
  components: {
  },
};
</script>
