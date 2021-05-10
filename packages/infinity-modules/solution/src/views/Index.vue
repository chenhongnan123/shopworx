<template>
  <div id="solution">
    <portal to="app-header">
      <span>{{ $t('solution.name') }}</span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0">
      <div class="stick">
        <div style="float: left; margin-bottom: 10px">
          <span v-if="!!solutiontypeValue" class="ml-2">
            {{ $t('solution.main.header.type') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setSolutiontypeValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ solutiontypeValue }}
              </div>
            </v-btn>
          </span>
        </div>
        <div style="float: right">
          <v-btn small color="primary" class="text-none" @click="setAddSolutionDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('solution.general.add') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('solution.general.refresh') }}
          </v-btn>
          <v-btn
            small
            color="error"
            outlined
            class="text-none ml-2"
            v-if="solutionList.length && solutionSelected.length"
            @click="confirmDialog = true"
          >
            <v-icon small left>mdi-delete</v-icon>
            {{ $t('solution.general.delete') }}
          </v-btn>
          <!-- <v-btn small color="primary" outlined class="text-none ml-2" @click="exportData">
            Export
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="exportSampleData">
            Export Sample File
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="importData">
            Import
          </v-btn>
          <input
            multiple
            type="file"
            accept=".csv"
            ref="uploader"
            class="d-none"
            id="uploadFiles"
            @change="onFilesChanged"
          /> -->
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('solution.general.filter') }}
          </v-btn>
        </div>
      </div>
      <v-data-table
        v-model="solutionSelected"
        :headers="headers"
        item-key="id"
        :items="solutionList"
        :options="{ itemsPerPage: 10 }"
        show-select
      >
        <template v-slot:item.name="{ item }">
          <span @click="handleClick(item)"
            ><a>{{ item.name }}</a></span
          >
        </template>
        <template v-slot:item.createdtime="{ item }">
          <span>{{
            item.createdtime ? format(new Date(Number(item.createdtime)), 'yyyy-MM-dd HH:mm') : ''
          }}</span>
        </template>
      </v-data-table>
      <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title primary-title>
            <span> {{ $t('solution.general.confirmheader') }}</span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text> {{ $t('solution.general.confirmmessage') }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="text-none"
              :loading="saving"
              @click="handleDeleteSolution"
            >
              {{ $t('solution.general.yes') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <solution-filter />
      <add-solution />
    </v-container>
  </div>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';
import { mapActions, mapState, mapMutations } from 'vuex';
import SolutionFilter from '../components/SolutionFilter.vue';
import AddSolution from '../components/AddSolution.vue';

export default {
  name: 'Solution',
  components: {
    SolutionFilter,
    AddSolution,
  },
  data() {
    return {
      format: formatDate,
      headers: [
        { text: this.$t('solution.main.header.id'), value: 'id' },
        { text: this.$t('solution.main.header.name'), value: 'name' },
        { text: this.$t('solution.main.header.type'), value: 'type' },
        { text: this.$t('solution.main.header.version'), value: 'version' },
        { text: this.$t('solution.main.header.editedby'), value: 'editedby' },
        { text: this.$t('solution.main.header.editedtime'), value: 'editedtime' },
        { text: this.$t('solution.main.header.createdby'), value: 'createdby' },
        { text: this.$t('solution.main.header.createdtime'), value: 'createdtime' },
      ],
      solutionSelected: [],
      imgpre: null,
      showprev: false,
      editposition: null,
      editdepartment: null,
      confirmDialog: false,
      saving: false,
      editphoto: null,
    };
  },
  computed: {
    ...mapState('solution', [
      'filter',
      'addSolutionDialog',
      'isApply',
      'solutionList',
      'solutiontypeValue',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  watch: {
    solutiontypeValue(val) {
      if (!val) {
        this.setSolutiontypeValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
  async created() {
    this.getAssets();
    this.getRecords('?pagenumber=1&pagesize=10');
    await this.getSolutiontypes();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('solution', [
      'toggleFilter',
      'setAddSolutionDialog',
      'setApply',
      'setSolutiontypeValue',
      'setSolutionList',
    ]),
    ...mapActions('solution', [
      'updateSolution',
      'deleteSolution',
      'createSolution',
      'createSolutionList',
      'getRecords',
      'getSolutiontypes',
      'getAssets',
    ]),
    handleClick(value) {
      this.$router.push({ name: 'solutiondetail', params: { id: value.id } });
    },
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.type) {
        query += `%26%26type=="${this.type}"`;
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
    async handleDeleteSolution() {
      // TODO: Check If used before deleting
      // eslint-disable-next-line max-len
      const results = await Promise.all(
        this.solutionSelected.map((solution) => this.deleteSolution(solution.id)),
      );
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        const solutionList = await this.getRecords(this.getQuery());
        if (solutionList.length === 0) {
          this.setDepartmentValue('');
          this.setPositionValue('');
          await this.getRecords(this.getQuery());
        }
        this.saving = false;
        this.confirmDialog = false;
        this.solutionSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'delete_solution',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'delete_solution',
        });
      }
    },
  },
};
</script>

<style lang="sass">
#solution
  height: 100%
  width: 100%
  .stick
    width: 100%
    padding: 20px 0
    overflow: hidden
    z-index: 1
.photo
  display: grid
  grid-template-rows: 1fr
  gap: 10px
  grid-template-columns: 48px 1fr
  align-items: center
  .v-small-dialog
    display: none
</style>
