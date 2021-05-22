<template>
  <v-container fluid class="py-0" style="height: calc(100vh - 56px);">
    <div class="stick py-3" style="height: 50px;">
      <!-- <div style="float: left; margin-bottom: 10px">
        <span v-if="machineList.length && !!listmachineValue" class="ml-2">
          {{ $t('general.machine') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2"
            @click="setListMachineValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px;">
              {{ machineList.filter((item) => item.id === listmachineValue)[0].name }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!listtypeValue" class="ml-2">
          {{ $t('maintenancetask.filter.type') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setListTypeValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate" style="max-width: 100px">
              {{ listtypeValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!liststatusValue" class="ml-2">
          {{ $t('maintenancetask.filter.status') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setListStatusValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ liststatusValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!startdateValue" class="ml-2">
          {{ $t('maintenancetask.filter.startdate') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setStartdateValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ startdateValue }}
            </div>
          </v-btn>
        </span>
        <span v-if="!!enddateValue" class="ml-2">
          {{ $t('maintenancetask.filter.enddate') }}:
          <v-btn
            small
            color="normal"
            outlined
            class="text-none ml-2 text-truncate"
            @click="setEnddateValue('')"
          >
            <v-icon small left>mdi-close</v-icon>
            <div class="text-truncate text-capitalize" style="max-width: 100px">
              {{ enddateValue }}
            </div>
          </v-btn>
        </span>
      </div> -->
      <div style="float: right">
        <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleListFilter">
          <v-icon small left>mdi-filter-variant</v-icon>
          {{ $t('general.filter') }}
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-row class="full-width mt-1" style="height: calc(100% - 50px);overflow: auto;">
      <v-col>
        <v-card
          v-for="(item, i) in tasks"
          :key="i"
          :color="getColor(item.status)"
          style="width: 450px;margin: 0 auto; margin-bottom: 20px;"
        >
          <v-card-title class="title">
            <span>{{ format(Number(item.planstarttime), 'yyyy-MM-dd') }}</span>
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
                    >{{ $t('maintenancetask.taskheader.machinename') }}:
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
                    >{{ $t('maintenancetask.taskheader.solutionname') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{ item.solutionname }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-1">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('maintenancetask.taskheader.actualstarttime') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{
                      item.acturalstarttime
                        ? format(Number(item.acturalstarttime), 'yyyy-MM-dd HH:mm:ss')
                        : ''
                    }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
              <v-list-item-group class="mb-0">
                <v-list-item-content class="py-1">
                  <label class="font-weight-bold" style="flex: none;"
                    >{{ $t('maintenancetask.taskheader.actualendtime') }}:
                  </label>
                  <v-spacer style="flex: none;"></v-spacer>
                  <v-chip style="flex: none;font-size: 15px;" small outlined class="text-none">
                    {{
                      item.acturalendtime
                        ? format(Number(item.acturalendtime), 'yyyy-MM-dd HH:mm:ss')
                        : ''
                    }}
                  </v-chip>
                </v-list-item-content>
              </v-list-item-group>
            </v-list>
          </v-card-text>
          <v-card-actions class="py-0">
            <v-spacer></v-spacer>
            <v-btn text color="white accent-4" @click="handleClick(item)">
              {{ $t('general.more') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <task-list-filter />
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatDate, dayStart, dayEnd } from '@shopworx/services/util/date.service';
import TaskListFilter from '../components/task/TaskListFilter.vue';

export default {
  name: 'MaintenancList',
  components: { TaskListFilter },
  data() {
    return {
      format: formatDate,
    };
  },
  async created() {
    await this.getAssets();
    await this.getRecords('?query=status!="new"&pagenumber=1&pagesize=10');
    await this.getTaskOperatorList(`?query=operatorid=="${this.operator.id}"`);
    await this.getLineList();
    await this.getMachineList();
    await this.getSublineList();
    await this.getOperatorList();
    await this.getSolutionRecords();
  },
  methods: {
    ...mapActions('maintenance', [
      'getRecords',
      'getLineList',
      'getSublineList',
      'getMachineList',
      'getSolutionRecords',
      'deletePlan',
      'getOperatorList',
      'getAssets',
      'getTaskOperatorList',
    ]),
    ...mapMutations('maintenance', [
      'toggleListFilter',
      'setAddTaskDialog',
      'setApply',
      'setPlanList',
      'setListTypeValue',
      'setListMachineValue',
      'setListStatusValue',
      'setStartdateValue',
      'setEnddateValue',
    ]),
    getColor(status) {
      if (status === 'in progress') return 'red';
      if (status === 'assigned') return 'orange';
      if (status === 'completed') return 'green';
      return 'blue';
    },
    handleClick(value) {
      this.$router.push({ name: 'taskdetail', params: { id: value.id } });
    },
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0%26%26status!="new"`;
      if (this.startdateValue) {
        const start = new Date(dayStart(new Date(this.startdateValue))).getTime();
        query += `%26%26planendtime>${start}`;
      }
      if (this.enddateValue) {
        const end = new Date(dayEnd(new Date(this.enddateValue))).getTime();
        query += `%26%26planstarttime<${end}`;
      }
      if (this.listtypeValue) {
        query += `%26%26typeValue=="${this.listtypeValue}"`;
      }
      if (this.listmachineValue) {
        query += `%26%26machineid=="${this.listmachineValue}"`;
      }
      if (this.liststatusValue) {
        query += `%26%26status=="${this.liststatusValue}"`;
      }
      if (
        // prettier-ignore
        !this.listtypeValue && !this.listmachineValue && !this.liststatusValue
        && !this.startdateValue && !this.enddateValue
      ) {
        query = '';
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
  },
  computed: {
    ...mapState('maintenance', [
      'taskList',
      'planList',
      'machineList',
      'listtypeValue',
      'listmachineValue',
      'liststatusValue',
      'startdateValue',
      'enddateValue',
      'assets',
      'taskOperatorList',
    ]),
    ...mapState('auth', ['operator']),
    tasks() {
      const todo = this.taskList.filter(
        (task) => this.taskOperatorList.filter((item) => item.taskid === task.id).length > 0,
      );
      return todo;
    },
  },
  watch: {
    listtypeValue(val) {
      if (!val) {
        this.setListTypeValue('');
        this.getRecords(this.getQuery());
      }
    },
    listmachineValue(val) {
      if (!val) {
        this.setListMachineValue('');
        this.getRecords(this.getQuery());
      }
    },
    liststatusValue(val) {
      if (!val) {
        this.setListStatusValue('');
        this.getRecords(this.getQuery());
      }
    },
    startdateValue(val) {
      if (!val) {
        this.setStartdateValue('');
        this.getRecords(this.getQuery());
      }
    },
    enddateValue(val) {
      if (!val) {
        this.setEnddateValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
};
</script>
