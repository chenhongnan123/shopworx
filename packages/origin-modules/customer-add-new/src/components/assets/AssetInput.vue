<template>
  <v-card flat>
    <v-card-text>
      <v-row no-gutters>
        <v-col>
          <v-btn
            small
            @click="addRow"
            color="success"
            class="text-none"
            :disabled="disable"
          >
            <v-icon left>mdi-plus</v-icon>
            Add asset
          </v-btn>
          <v-btn
            small
            color="error"
            @click="deleteSelectedRows"
            class="text-none ml-2"
            :disabled="!rowsSelected || disable"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete selected asset(s)
          </v-btn>
        </v-col>
      </v-row>
      <ag-grid-vue
        :rowData="rowData"
        rowSelection="multiple"
        class="ag-theme-balham mt-1"
        :columnDefs="columnDefs"
        :gridOptions="gridOptions"
        :defaultColDef="defaultColDef"
        :suppressRowClickSelection="true"
        :suppressDragLeaveHidesColumns="true"
        style="width: 100%; height: 300px;"
        @selection-changed="onSelectionChanged"
      />
      <div class="mt-8">
        Please share the following with the license generator:
      </div>
      <ul>
        <li>
          Asset count: <span class="primary--text font-weight-medium">
            {{ rowData.length }}
          </span>
        </li>
        <li>
          Asset Id: <span class="primary--text font-weight-medium">
            {{ assetInfo.id }}
          </span>
        </li>
        <li>
          Customer Id: <span class="primary--text font-weight-medium">
            {{ customerId }}
          </span>
        </li>
        <li>
          Site Id: <span class="primary--text font-weight-medium">
            {{ siteId }}
          </span>
        </li>
        <li>
          License start date: <span class="primary--text font-weight-medium">
            {{ beginDate }}
          </span>
        </li>
        <li>
          License expiry date: <span class="primary--text font-weight-medium">
            31-12-2030
          </span>
        </li>
      </ul>
      <v-text-field
        outlined
        dense
        class="mt-4"
        v-model="license"
        :disabled="disable"
        label="License key*"
        :rules="requiredRule"
      ></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { AgGridVue } from 'ag-grid-vue';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'AssetInput',
  components: {
    AgGridVue,
  },
  props: {
    assetInfo: {
      type: Object,
      required: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      license: '',
      rowData: [],
      columnDefs: [],
      rowsSelected: false,
      gridApi: null,
      gridOptions: null,
      gridColumnApi: null,
      defaultColDef: null,
      licenseTimestamp: new Date().getTime(),
      requiredRule: [
        (v) => !!v || 'Required.',
      ],
    };
  },
  beforeMount() {
    this.gridOptions = {
      stopEditingWhenGridLosesFocus: true,
    };
    this.defaultColDef = {
      filter: false,
      editable: !this.disable,
      resizable: true,
      floatingFilter: false,
      checkboxSelection: this.isFirstColumn,
      headerCheckboxSelection: this.isFirstColumn,
      headerCheckboxSelectionFilteredOnly: this.isFirstColumn,
    };
    this.setColumnDefs();
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.license = this.assetInfo.license;
    this.rowData = [...this.assetInfo.records];
  },
  computed: {
    ...mapState('newCustomer', ['customerData']),
    tags() {
      return this.assetInfo.tags
        .filter((t) => (
          t.tagName !== 'assetid'
          && t.tagName !== 'manualplanstart'
          && t.tagName !== 'manualplanstop'
        ));
    },
    beginDate() {
      return formatDate(this.licenseTimestamp, 'dd-MM-yyyy');
    },
    customerId() {
      return this.customerData['1'].data.customerPayload.id;
    },
    siteId() {
      return this.customerData['1'].data.sitePayload.id;
    },
  },
  methods: {
    setColumnDefs() {
      this.columnDefs = this.tags.map((tag) => ({
        headerName: tag.tagDescription,
        field: tag.tagName,
      }));
    },
    isFirstColumn(params) {
      const displayedColumns = params.columnApi.getAllDisplayedColumns();
      const thisIsFirstColumn = displayedColumns[0] === params.column;
      return thisIsFirstColumn && !this.disable;
    },
    onSelectionChanged(event) {
      this.rowsSelected = event.api.getSelectedRows().length > 0;
    },
    getNewRowItem() {
      return this.tags.reduce((acc, tag) => {
        acc[tag.tagName] = undefined;
        return acc;
      }, {});
    },
    addRow() {
      this.gridApi.applyTransaction({
        add: [this.getNewRowItem()],
        addIndex: 0,
      });
      this.rowData.unshift(this.getNewRowItem());
    },
    deleteSelectedRows() {
      const selectedRows = this.gridApi.getSelectedRows();
      this.gridApi.applyTransaction({ remove: selectedRows });
      this.rowsSelected = this.gridApi.getSelectedRows().length > 0;
    },
  },
};
</script>
