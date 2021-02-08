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
          Add new
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
          Save
        </v-btn>
        <!-- <v-btn
          small
          outlined
          color="success"
          class="text-none"
          @click="updateValueFun"
          :class="'ml-2'"
          v-if="showUpdateBtn"
        >
          Update
        </v-btn> -->
        <v-btn
          small
          outlined
          color="error"
          class="text-none"
          @click="deleteEntry"
          :class="'ml-2'"
          v-if="showDeleteBtn"
        >
          Delete
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="refreshUi"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
          @click="onBtnExport"
        >
          <v-icon small v-text="'$download'" left></v-icon>
          Export
          <v-icon small v-text="'mdi-chevron-down'" right></v-icon>
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
        <span v-text="asset.assetDescription"></span>
      </v-tab>
      <v-tab-item
        :key="asset.id"
        v-for="asset in getAssets(id)"
      >
        <base-master
          :assetId="asset.id"
          :id="id"
          ref="base"
        />
      </v-tab-item>
    </v-tabs>
    <base-master
      v-else
      :id="id"
      ref="base"
      @showupdatebtnemt="visibleUpdateBtn"
      @savebtnshow="visibleSaveBtn"
      @deletebtnshow="visibleDeleteBtn"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import BaseMaster from '../components/BaseMaster.vue';

export default {
  name: 'MasterWindow',
  components: {
    BaseMaster,
  },
  data() {
    return {
      base: '',
      tab: 0,
      showUpdateBtn: false,
      showSaveBtn: false,
      showDeleteBtn: false,
    };
  },
  mounted() {
    this.base = this.$refs.base;
  },
  methods: {
    ...mapActions('masters', ['deleteRecord']),
    ...mapMutations('helper', ['setAlert']),
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
    refreshUi() {
      this.base.fetchRecords();
      this.base.newData = [];
      this.base.updateData = [];
      this.showSaveBtn = false;
    },
  },
  computed: {
    ...mapGetters('masters', ['showTabs', 'getAssets']),
    id() {
      return this.$route.params.id;
    },
  },
};
</script>
