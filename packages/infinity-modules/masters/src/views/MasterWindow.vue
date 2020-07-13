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
          color="primary"
          class="text-none"
          @click="saveNewEntry"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          Save
        </v-btn>
        <v-btn
          small
          outlined
          color="error"
          class="text-none"
          @click="deleteEntry"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'ml-4'"
        >
          Delete
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
        >
          <v-icon small v-text="'mdi-refresh'" left></v-icon>
          Refresh
        </v-btn>
        <v-btn
          small
          outlined
          color="primary"
          class="text-none ml-2"
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
        />
      </v-tab-item>
    </v-tabs>
    <base-master
      v-else
      :id="id"
      ref="base"
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
    };
  },
  methods: {
    ...mapActions('masters', ['postBulkRecords', 'deleteRecord']),
    ...mapMutations('helper', ['setAlert']),
    addNewEntry() {
      this.$refs.base.addRow();
    },
    async deleteEntry() {
      if (this.$refs.base.gridApi.getSelectedRows()) {
        const selectedRow = this.$refs.base.gridApi.getSelectedRows();
        // elementName
        const name = this.$refs.base.id;
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
          this.$refs.base.deleteSelectedRows();
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
      const name = this.$refs.base.id;
      const payload = [];
      this.$refs.base.rowData.forEach((data) => {
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
        this.$refs.base.fetchRecords();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_CREATING_RECORD',
        });
      }
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
