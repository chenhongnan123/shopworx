<template>
  <div>
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
        <span v-text="asset.assetDescription"></span>
      </v-tab>
      <v-tab-item
        :key="asset.id"
        v-for="asset in getAssets(id)"
      >
        <log-base-master
          :assetId="asset.id"
          :id="id"
          ref="base"
        />
      </v-tab-item>
    </v-tabs>
    <log-base-master
      v-else
      :id="id"
      ref="base"
      @showupdatebtnemt="visibleUpdateBtn"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import LogBaseMaster from '../components/LogBaseMaster.vue';

export default {
  name: 'LogMasterWindow',
  components: {
    LogBaseMaster,
  },
  data() {
    return {
      base: '',
      tab: 0,
      showUpdateBtn: false,
    };
  },
  mounted() {
    this.base = this.$refs.base;
  },
  methods: {
    ...mapActions('logManagement', ['postBulkRecords', 'deleteRecord']),
    ...mapMutations('helper', ['setAlert']),
    visibleUpdateBtn(value) {
      this.showUpdateBtn = value;
    },
    addNewEntry() {
      this.base.addRow();
    },
    async deleteEntry() {
      if (this.base.gridApi.getSelectedRows()) {
        const selectedRow = this.base.gridApi.getSelectedRows();
        const name = this.id;
        let deleted = '';
        await Promise.all([
          selectedRow.forEach((row) => {
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
      }
    },
    async saveNewEntry() {
      if (this.base.updateData.length > 0) {
        this.base.updateValue();
      } else {
        const name = this.id;
        const payload = [];
        this.base.rowData.forEach((data) => {
          if (!data.elementName) {
            payload.push({
              ...data,
              assetid: 4,
            });
          }
        });
        const postData = await this.postBulkRecords({ payload, name });
        if (postData) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATED_RECORD',
          });
          this.base.fetchRecords();
        } else {
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ERROR_CREATING_RECORD',
          });
        }
      }
    },
    updateValueFun() {
      this.base.updateValue();
    },
    onBtnExport() {
      this.base.exportData();
    },
    refreshUi() {
      this.base.fetchRecords();
    },
  },
  computed: {
    ...mapGetters('logManagement', ['showTabs', 'getAssets']),
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
