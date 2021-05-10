<template>
  <div id="solution">
    <portal to="app-header">
      <span>{{ $t('maintenanceplan.name') }}</span>
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
          <span v-if="machineList.length && !!machineValue" class="ml-2">
            {{ $t('maintenanceplan.general.machine') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2"
              @click="setMachineValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px;">
                {{ machineList.filter((item) => item.id === machineValue)[0].machinename }}
              </div>
            </v-btn>
          </span>
          <span v-if="!!typeValue" class="ml-2">
            {{ $t('maintenanceplan.header.type') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setTypeValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ typeValue }}
              </div>
            </v-btn>
          </span>
        </div>
        <div style="float: right">
          <v-btn small color="primary" class="text-none" @click="setAddPlanDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('maintenanceplan.general.add') }}
          </v-btn>
          <v-btn
            small
            color="green"
            outlined
            class="text-none ml-2"
            v-if="planList.length && planSelected.length == 1"
            @click="toggleStatus"
          >
            <v-icon small left v-if="planSelected[0].status == 'unable'">
              mdi-checkbox-marked-circle-outline
            </v-icon>
            <v-icon small left v-else>mdi-minus-circle-outline</v-icon>
            {{
              planSelected[0].status == 'enable'
                ? $t('maintenanceplan.general.unable')
                : $t('maintenanceplan.general.enable')
            }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('maintenanceplan.general.refresh') }}
          </v-btn>
          <v-btn
            small
            color="error"
            outlined
            class="text-none ml-2"
            v-if="planList.length && planSelected.length >= 1 && planSelected[0].status == 'unable'"
            @click="confirmDialog = true"
          >
            <v-icon small left>mdi-delete</v-icon>
            {{ $t('maintenanceplan.general.delete') }}
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
            {{ $t('maintenanceplan.general.filter') }}
          </v-btn>
        </div>
      </div>
      <v-data-table
        v-model="planSelected"
        :headers="headers"
        item-key="planid"
        :items="planList"
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
            <span> {{ $t('maintenanceplan.general.confirmheader') }} </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text> {{ $t('maintenanceplan.general.confirmmessage') }} </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="text-none" :loading="saving" @click="handleDeletePlan">
              {{ $t('maintenanceplan.general.yes') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
    <add-plan />
    <plan-filter />
  </div>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';
import { mapActions, mapState, mapMutations } from 'vuex';
import AddPlan from '../components/AddPlan.vue';
import PlanFilter from '../components/PlanFilter.vue';

export default {
  components: { PlanFilter, AddPlan },
  name: 'MaintenancePlan',
  data() {
    return {
      format: formatDate,
      headers: [
        { text: this.$t('maintenanceplan.header.id'), value: 'planid', width: 80 },
        { text: this.$t('maintenanceplan.header.name'), value: 'name' },
        { text: this.$t('maintenanceplan.header.type'), value: 'type', width: 60 },
        { text: this.$t('maintenanceplan.header.machinename'), value: 'machinename' },
        { text: this.$t('maintenanceplan.header.solutionname'), value: 'solutionname' },

        { text: this.$t('maintenanceplan.header.status'), value: 'status', width: 60 },
        // { text: 'Unit', value: 'unit', width: 60 },
        { text: this.$t('maintenanceplan.header.duration'), value: 'duration' },
        { text: this.$t('maintenanceplan.header.cron'), value: 'cronname' },
        { text: this.$t('maintenanceplan.header.alltask'), value: 'alltask' },

        { text: this.$t('maintenanceplan.header.editedby'), value: 'editedby' },
        { text: this.$t('maintenanceplan.header.editedtime'), value: 'editedtime' },
        { text: this.$t('maintenanceplan.header.createdby'), value: 'createdby' },
        { text: this.$t('maintenanceplan.header.createdtime'), value: 'createdtime' },
      ],
      planSelected: [],
      imgpre: null,
      showprev: false,
      confirmDialog: false,
      saving: false,
    };
  },
  computed: {
    ...mapState('plan', [
      'filter',
      'addPlanDialog',
      'isApply',
      'planList',
      'machineList',
      'typeValue',
      'machineValue',
      'assets',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  watch: {
    typeValue(val) {
      if (!val) {
        this.setTypeValue('');
        this.getRecords(this.getQuery());
      }
    },
    machineValue(val) {
      if (!val) {
        this.setMachineValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
  async created() {
    this.getAssets();
    this.getRecords('?pagenumber=1&pagesize=10');
    await this.getLineList();
    await this.getMachineList();
    await this.getSublineList();
    await this.getSolutionRecords();
    await this.getCronRecords();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('plan', [
      'toggleFilter',
      'setAddPlanDialog',
      'setApply',
      'setPlanList',
      'setTypeValue',
      'setMachineValue',
    ]),
    ...mapActions('plan', [
      'getRecords',
      'getLineList',
      'getSublineList',
      'getMachineList',
      'getSolutionRecords',
      'getCronRecords',
      'deletePlan',
      'updatePlan',
      'getAssets',
    ]),
    handleClick(value) {
      this.$router.push({ name: 'maintenance-plandetail', params: { id: value.planid } });
    },
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.typeValue) {
        query += `%26%26typeValue=="${this.typeValue}"`;
      }
      if (this.machineValue) {
        query += `%26%26machineid=="${this.machineValue}"`;
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
    async handleDeletePlan() {
      // TODO: Check If used before deleting
      // eslint-disable-next-line max-len
      const results = await Promise.all(
        this.planSelected.map((plan) => this.deletePlan(plan.planid)),
      );
      if (results.every((bool) => bool === true)) {
        this.saving = true;
        const planList = await this.getRecords(this.getQuery());
        if (planList.length === 0) {
          this.setTypeValue('');
          this.setMachineValue('');
          await this.getRecords(this.getQuery());
        }
        this.saving = false;
        this.confirmDialog = false;
        this.planSelected = [];
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DELETE_MAINTENANCE_PLAN',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'DELETE_MAINTENANCE_PLAN',
        });
      }
    },
    async toggleStatus() {
      const { planSelected } = this;
      if (planSelected.length === 1) {
        const getAssetId = this.assets
          .filter((item) => item.status === 'ACTIVE')
          .reduce((acc, item) => acc + item.id, 0);
        const payload = {
          status: planSelected[0].status === 'enable' ? 'unable' : 'enable',
          assetid: getAssetId,
        };
        this.saving = true;
        const rst = await this.updatePlan({ id: planSelected[0]._id, payload });
        this.saving = false;
        if (rst) {
          this.getRecords(this.getQuery());
          this.setAlert({
            show: true,
            type: 'success',
            message: 'UPDATE_MAINTENANCE_PLAN',
          });
        }
        this.planSelected = [];
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
