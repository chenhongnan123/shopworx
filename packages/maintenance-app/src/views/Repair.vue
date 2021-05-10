<template>
  <v-container fluid class="py-0" style="height: calc(100vh - 56px);">
    <div class="stick py-3" style="height: 50px;">
      <div style="float: right">
        <v-btn
          small
          color="primary"
          outlined
          class="text-none ml-2"
          @click="setAddRepairDialog(true)"
        >
          <v-icon small left>mdi-plus</v-icon>
          {{ $t('general.add') }}
        </v-btn>
        <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleRepairFilter">
          <v-icon small left>mdi-filter-variant</v-icon>
          {{ $t('general.filter') }}
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-row class="full-width mt-1" style="height: calc(100% - 50px);overflow: auto;">
      <v-col>
        <v-card
          v-for="(item, i) in repairList"
          :key="i"
          :color="getColor(item.status)"
          style="width: 450px;margin: 0 auto; margin-bottom: 20px;"
        >
          <v-card-title class="title">
            <span>{{ item.machinename }}</span>
            <v-spacer></v-spacer>
            <v-btn small color="white" outlined class="text-none">
              {{ item.status }}
            </v-btn>
          </v-card-title>
          <v-card-text class="white text--primary pa-0">
            <v-list class="pb-0 px-4">
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <span class="font-weight-bold" style="flex: none;"
                    >{{ $t('repair.repairheader.machinename') }}:
                  </span>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{ item.machinename }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('repair.repairheader.fault') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{ item.faultname }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('repair.repairheader.actualstarttime') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{
                      item.starttime ? format(Number(item.starttime), 'yyyy-MM-dd HH:mm:ss') : ''
                    }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-0">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('repair.repairheader.actualendtime') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{ item.endtime ? format(Number(item.endtime), 'yyyy-MM-dd HH:mm:ss') : '' }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions class="py-0">
            <v-spacer></v-spacer>
            <v-btn
              text
              color="white accent-4"
              :disabled="item.status != 'new'"
              @click="
                confirmdialog = true;
                repairInfo = item;
              "
            >
              {{ $t('general.close') }}
            </v-btn>
            <v-btn text color="white accent-4" @click="handleClick(item)">
              {{ $t('general.more') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <add-repair />
    <repair-filter />
    <v-dialog
      id="reportconfirm"
      v-model="confirmdialog"
      persistent
      scrollable
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="primary">
          <span class="white--text">
            {{ $t('repair.confirmreport') }}
          </span>
        </v-card-title>
        <v-card-text class="black--text text-h6">
          {{ $t('general.closerepair') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text class="text-none" @click="confirmdialog = false">
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn color="primary" class="text-none" :loading="saving" @click="closeRepair">
            {{ $t('general.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { formatDate, dayStart, dayEnd } from '@shopworx/services/util/date.service';

import addRepair from '../components/repair/addRepair.vue';
import RepairFilter from '../components/repair/RepairFilter.vue';

export default {
  components: { addRepair, RepairFilter },
  name: 'Repair',
  data() {
    return {
      format: formatDate,
      confirmdialog: false,
      repairInfo: null,
      saving: false,
    };
  },
  computed: {
    ...mapState('maintenance', [
      'assets',
      'machineList',
      'repairList',
      'repairmachineValue',
      'repairstatusValue',
      'repairstartdateValue',
      'repairenddateValue',
    ]),
    ...mapState('auth', ['operator']),
    userName: {
      get() {
        return this.operator.operatorname;
      },
    },
  },
  async created() {
    await this.getAssets();
    this.getFaultList();
    this.getMachineList();
    await this.getRepairByQuery('?pagenumber=1&pagesize=10');
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('maintenance', ['setAddRepairDialog', 'toggleRepairFilter']),
    ...mapActions('maintenance', [
      'getRecords',
      'getMachineList',
      'getOperatorList',
      'updateTask',
      'getAssets',
      'getSolutionDetailRecords',
      'getSparepartinplanningRecords',
      'getSparepartRecords',
      'postBulkRecords',
      'getReplacementList',
      'getTaskDetailList',
      'postSystemMessage',
      'updateRecordById',
      'createReplacement',
      'updateRecordByQuery',
      'getFaultList',
      'getRepairByQuery',
      'updateRepair',
    ]),
    getColor(status) {
      if (status === 'in progress') return 'red';
      if (status === 'completed') return 'green';
      if (status === 'close') return 'grey';
      return 'blue';
    },
    handleClick(value) {
      this.$router.push({ name: 'repairdetail', params: { id: value.id } });
    },
    getQuery() {
      let query = '?query=status!="assigned"';
      if (this.repairstartdateValue) {
        const start = new Date(dayStart(new Date(this.repairstartdateValue))).getTime();
        query += `%26%26endtime>${start}`;
      }
      if (this.repairenddateValue) {
        const end = new Date(dayEnd(new Date(this.repairenddateValue))).getTime();
        query += `%26%26starttime<${end}`;
      }
      if (this.repairmachineValue) {
        query += `%26%26machineid=="${this.repairmachineValue}"`;
      }
      if (this.repairstatusValue) {
        query += `%26%26status=="${this.repairstatusValue}"`;
      }
      if (
        // prettier-ignore
        !this.repairmachineValue && !this.repairstatusValue
        && !this.repairstartdateValue && !this.repairenddateValue
      ) {
        query = '?pagenumber=1&pagesize=10';
      }
      return query;
    },
    async RefreshUI() {
      await this.getRepairByQuery(this.getQuery());
    },
    async closeRepair() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      this.saving = true;

      const putpaylod = {
        assetid: getAssetId,
        status: 'close',
        editedby: this.userName,
        editedtime: new Date().getTime(),
        endtime: new Date().getTime(),
        starttime: new Date().getTime(),
      };
      const task = await this.updateRepair({ id: this.repairInfo._id, payload: putpaylod });
      if (task) {
        this.getRepairByQuery(this.getQuery());
        this.setAlert({
          show: true,
          type: 'success',
          message: 'CLOSE_REPAIR',
        });
      }
      this.saving = false;
      this.confirmdialog = false;
    },
  },
};
</script>
