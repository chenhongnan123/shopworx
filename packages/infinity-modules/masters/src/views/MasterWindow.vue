<template>
  <div>
    <portal to="settings-header">
      <span>
        <v-btn
          small
          color="primary"
          class="text-none"
          @click="addNewEntry"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          <v-icon
            left
            small
            v-text="'mdi-plus'"
          ></v-icon>
          {{ $t('addNew') }}
        </v-btn>
        <v-btn
          small
          outlined
          color="success"
          class="text-none"
          @click="saveNewEntry"
          :class="'ml-2'"
          v-if="showSaveBtn"
        >
          {{ $t('save') }}
        </v-btn>
        <v-btn
          small
          outlined
          color="error"
          class="text-none"
          @click="deleteEntry"
          :class="'ml-2'"
          v-if="showDeleteBtn"
        >
          {{ $t('delete') }}
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="refreshUi"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          {{ $t('refresh') }}
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="onBtnExport"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          {{ $t('export') }}
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="uploadFile"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          {{ $t('Import') }}
        </v-btn>
        <input
          type="file"
          accept=".csv"
          ref="uploader"
          class="d-none"
          id="uploadFiles"
          @change="onFilesChanged"
        >
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="downloadSample"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          {{ $t('downloadCSV') }}
        </v-btn>
      </span>
    </portal>
    <v-tabs
      v-if="showTabs(id)"
      v-model="tab"
      :background-color="$vuetify.theme.dark ? '#121212': ''"
    >
      <v-tab
        :key="asset.id"
        class="text-none"
        v-for="asset in getAssets(id)"
      >
      <span v-text="$t(asset.assetName)"></span>
    </v-tab>
    </v-tabs>
     <base-master
      :assetId="showTabs(id) ? getAssets(id)[tab].id : 0"
      :id="id"
      ref="base"
      :fetchData="fetchData"
      @savebtnshow="visibleSaveBtn"
      @deletebtnshow="visibleDeleteBtn"
      @on-fetch="fetchedData"
    />
    <import-master-data
      ref="importer"
      :id="id"
      :records="tags"
      @on-imported="refreshUi"
      @on-close-dialog="resetForm"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import BaseMaster from '../components/BaseMaster.vue';
import ImportMasterData from '../components/import/ImportMasterData.vue';

export default {
  name: 'MasterWindow',
  components: {
    BaseMaster,
    ImportMasterData,
  },
  data() {
    return {
      base: '',
      tab: 0,
      showUpdateBtn: false,
      showSaveBtn: false,
      showDeleteBtn: false,
      fetchData: false,
    };
  },
  mounted() {
    this.base = this.$refs.base;
  },
  computed: {
    ...mapGetters('masters', ['showTabs', 'getAssets', 'getTags']),
    id() {
      return this.$route.params.id;
    },
    tags() {
      const assetId = this.showTabs(this.id) ? this.getAssets(this.id)[this.tab].id : 0;
      return this.getTags(this.id, assetId);
    },
  },
  watch: {
    id() {
      this.tab = 0;
      this.fetchingData();
    },
    tab() {
      this.fetchingData();
    },
  },
  methods: {
    ...mapActions('masters', ['deleteRecord']),
    ...mapMutations('helper', ['setAlert']),
    fetchingData() {
      this.fetchData = true;
      this.$emit('fetching', true);
    },
    fetchedData() {
      this.fetchData = false;
      this.$emit('fetching', false);
    },
    visibleUpdateBtn(value) {
      this.showUpdateBtn = value;
    },
    visibleSaveBtn(value) {
      this.showSaveBtn = value;
    },
    visibleDeleteBtn(value) {
      this.showDeleteBtn = value;
    },
    addNewEntry() {
      this.base.addRow();
    },
    async deleteEntry() {
      if (await this.$root.$confirm.open(
        'Delete record(s)',
        'Are you you want to delete?',
      )) {
        if (this.base.gridApi.getSelectedRows()) {
          const selectedRow = this.base.gridApi.getSelectedRows();
          const name = this.id;
          let deleted = '';
          await Promise.all([
            selectedRow.forEach((row) => {
              // eslint-disable-next-line
              const id = row._id;
              deleted = this.deleteRecord({ id, name });
            }),
          ]);
          if (deleted) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'DELETE_RECORD',
            });
            this.base.deleteSelectedRows();
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_DELETE_RECORD',
            });
          }
          this.base.newData = [];
          this.showSaveBtn = false;
        }
      }
    },
    saveNewEntry() {
      this.base.saveModifiedRecords();
    },
    onBtnExport() {
      this.base.exportData();
    },
    downloadSample() {
      this.base.downloadSampleCSV();
    },
    refreshUi() {
      this.base.refreshData();
    },
    uploadFile() {
      this.$refs.uploader.click();
    },
    resetForm() {
      this.$refs.uploader.value = null;
    },
    onFilesChanged(e) {
      this.$refs.importer.importCSV(e);
    },
  },
};
</script>
