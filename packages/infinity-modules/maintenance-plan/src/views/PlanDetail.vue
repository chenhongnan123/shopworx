<template>
  <div
    style="
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;"
  >
    <portal to="app-header">
      <span v-text="$t('maintenanceplan.detailtitle')"></span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0" style="height:100%;">
      <v-btn icon @click="$router.push({ name: 'maintenancePlan' })" color="primary">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span v-text="`${$t('maintenanceplan.name')} : `"> </span>
      <span v-text="planInfo.name ? planInfo.name : ''"></span>
      <v-row justify="center" class="px-6 mb-3">
        <v-card style="width:100%;">
          <v-card-title primary-title style="background-color: #28abb9;color: white;" class="py-1">
            <v-icon color="white" class="mr-2">mdi-information</v-icon>
            {{ $t('maintenanceplan.basic.title') }}
          </v-card-title>
          <v-card-text class="pt-1 pb-0">
            <v-form readonly class="mt-3">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    :label="$t('maintenanceplan.header.name')"
                    dense
                    v-model="planInfo.name"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('maintenanceplan.header.type')"
                    dense
                    v-model="planInfo.type"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('maintenanceplan.header.duration')"
                    dense
                    v-model="planInfo.duration"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="$t('maintenanceplan.header.machinename')"
                    dense
                    v-model="planInfo.machinename"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('maintenanceplan.header.solutionname')"
                    dense
                    v-model="planInfo.solutionname"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('maintenanceplan.header.status')"
                    dense
                    v-model="planInfo.status"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    :label="$t('maintenanceplan.header.alltask')"
                    dense
                    v-model="planInfo.alltask"
                  ></v-text-field>
                  <v-text-field
                    :label="$t('maintenanceplan.header.taskcompleted')"
                    dense
                    :value="taskList.filter((item) => item.status === 'completed').length"
                  ></v-text-field>
                  <!-- <v-text-field
                    label="Task In Progress"
                    dense
                    v-model="planInfo.taskinprogress"
                  ></v-text-field> -->
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row justify="center" class="px-6 mb-3">
        <v-col cols="9" class="py-0 pl-0 pr-3" style="height: 100%;">
          <v-card style="width:100%;height: 100%;">
            <v-card-title
              primary-title
              style="background-color: #f05454;color: white;"
              class="py-1"
            >
              <v-icon color="white" class="mr-2">mdi-timeline-check-outline</v-icon>
              {{ $t('maintenanceplan.timeline.title') }}
            </v-card-title>
            <v-card-text class="py-0" style="height: calc(100% - 40px);overflow: auto;">
              <v-timeline
                align-top
                style="width: 70%;margin: 0 auto;"
                :dense="$vuetify.breakpoint.smAndDown"
              >
                <v-timeline-item
                  v-for="(item, i) in timelineList"
                  :key="i"
                  :color="item.status == 'completed' ? 'green lighten-1' : 'orange lighten-1'"
                  :icon="
                    item.status == 'completed' ? 'mdi-clock-check-outline' : 'mdi-progress-clock'
                  "
                  fill-dot
                >
                  <v-card
                    :color="item.status == 'completed' ? 'green lighten-1' : 'orange lighten-1'"
                  >
                    <v-card-title class="title white--text">
                      <span>{{ format(Number(item.planstarttime), 'yyyy-MM-dd HH:mm:ss') }}</span>
                      <v-spacer></v-spacer>
                      <v-btn small color="white" outlined class="text-none">
                        {{ item.status }}
                      </v-btn>
                    </v-card-title>
                    <v-card-text class="white pb-0 px-0">
                      <v-list class="pb-0 px-4">
                        <v-list-item-group class="mb-1">
                          <label class="font-weight-bold"
                            >{{ $t('maintenanceplan.timeline.type') }}:
                          </label>
                          {{ planInfo.type }}
                        </v-list-item-group>
                        <v-list-item-group class="mb-1">
                          <label class="font-weight-bold"
                            >{{ $t('maintenanceplan.timeline.trigger') }}:
                          </label>
                          {{ item.tasktrigger }}
                        </v-list-item-group>
                        <v-list-item-group class="mb-1">
                          <label class="font-weight-bold"
                            >{{ $t('maintenanceplan.timeline.actualstarttime') }}:</label
                          >
                          {{ item.acturalstarttime }}
                        </v-list-item-group>
                        <v-list-item-group class="mb-0">
                          <label class="font-weight-bold"
                            >{{ $t('maintenanceplan.timeline.actualendtime') }}:</label
                          >
                          {{ item.acturalendtime }}
                        </v-list-item-group>
                        <v-list-item-group class="mb-0">
                          <label class="font-weight-bold"
                            >{{ $t('maintenanceplan.timeline.operator') }}:</label
                          >
                          <v-chip
                            class="ma-2"
                            color="primary"
                            outlined
                            pill
                            small
                            v-for="(op, i) in item.taskoperators"
                            :key="i"
                          >
                            {{ op.operatorname }}
                          </v-chip>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text>
                    <v-card-actions class="py-0">
                      <v-spacer></v-spacer>
                      <v-btn text color="white accent-4" @click="jumpTo(item.id)">
                        {{ $t('maintenanceplan.general.more') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="3" class="pa-0" style="height: 100%;">
          <v-card style="width:100%;height: 100%;">
            <v-card-title
              primary-title
              style="background-color: #f05454;color: white;"
              class="py-1"
            >
              <v-icon color="white" class="mr-2">mdi-cogs</v-icon>
              {{ $t('maintenanceplan.sparepart.title') }}
              <v-spacer></v-spacer>
              <v-btn
                small
                color="white"
                outlined
                class="text-none"
                @click="setAddSparepartDialog(true)"
              >
                <v-icon small left>mdi-plus</v-icon>
                {{ $t('maintenanceplan.general.add') }}
              </v-btn>
            </v-card-title>
            <v-card-text style="height: calc(100% - 40px);overflow: auto;">
              <v-card class="mt-2" v-for="sparepart in sparepartList" :key="sparepart._id">
                <v-card-title primary-title class="py-1">
                  <v-avatar color="indigo" size="30" class="mr-3">
                    <v-icon dark>mdi-cog</v-icon>
                  </v-avatar>
                  {{ $t('maintenanceplan.sparepart.sparepart') }}: {{ sparepart.sparepartname }}
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    color="green"
                    @click="
                      setEditSparepartDialog(true);
                      updated = sparepart._id;
                    "
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    color="red"
                    @click="
                      confirmDialog = true;
                      toDelete = sparepart._id;
                    "
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-row class="mx-0">
                    <v-col cols="4" class="py-0">
                      <v-subheader style="height: 24px;justify-content: center;">{{
                        $t('maintenanceplan.sparepart.position')
                      }}</v-subheader>
                      <p class="text-center font-weight-bold">
                        {{ sparepart.machinepositionname }}
                      </p>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <v-subheader style="height: 24px;justify-content: center;">{{
                        $t('maintenanceplan.sparepart.lower')
                      }}</v-subheader>
                      <p class="text-center font-weight-bold">
                        {{ sparepart.lower }}
                      </p>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <v-subheader style="height: 24px;justify-content: center;">{{
                        $t('maintenanceplan.sparepart.upper')
                      }}</v-subheader>
                      <p class="text-center font-weight-bold">
                        {{ sparepart.upper }}
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
      <v-card>
        <v-card-title primary-title>
          <span>
            <span> {{ $t('maintenanceplan.general.confirmheader') }} </span>
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            small
            @click="
              confirmDialog = false;
              toDelete = null;
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <span> {{ $t('maintenanceplan.general.confirmmessage') }} </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            @click="deleteSparepart(toDelete)"
          >
            <span> {{ $t('maintenanceplan.general.yes') }} </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <add-sparepart-in-planning />
    <edit-sparepart-in-planning :updated="updated" />
  </div>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';
import { mapState, mapMutations, mapActions } from 'vuex';
// import _ from 'lodash';
import AddSparepartInPlanning from '../components/AddSparepartInPlanning.vue';
import EditSparepartInPlanning from '../components/EditSparepartInPlanning.vue';

export default {
  name: 'MaintenancePlanDetail',
  components: { AddSparepartInPlanning, EditSparepartInPlanning },
  data() {
    return {
      format: formatDate,
      show: false,
      solutiondetails: [],
      confirmDialog: false,
      toDelete: null,
      saving: false,
      putrecord: null,
      updated: null,
      items: [
        {
          color: 'green lighten-1',
          icon: 'mdi-clock-check-outline',
        },
        {
          color: 'green lighten-1',
          icon: 'mdi-clock-check-outline',
        },
        {
          color: 'green lighten-1',
          icon: 'mdi-clock-check-outline',
        },
        {
          color: 'orange lighten-1',
          icon: 'mdi-progress-clock',
        },
      ],
    };
  },
  watch: {
    planList() {
      this.planInfo = { ...this.planList.filter((item) => item.planid === this.planid)[0] };
    },
    editSparepartDialog(val) {
      if (!val) {
        this.updated = null;
      }
    },
  },
  computed: {
    ...mapState('auth', ['sessionId']),
    ...mapState('plan', ['planList', 'taskList', 'taskOperatorList', 'sparepartList']),
    planInfo: {
      get() {
        if (this.planList.filter((item) => item.planid === this.planid).length > 0) {
          return this.planList.filter((item) => item.planid === this.planid)[0];
        }
        return {
          name: '',
          type: '',
          description: '',
        };
      },
      set() {},
    },
    timelineList() {
      // eslint-disable-next-line arrow-body-style
      return this.taskList.map((task) => {
        return {
          ...task,
          // eslint-disable-next-line arrow-body-style
          taskoperators: this.taskOperatorList.filter((op) => {
            return op.taskid === task.id;
          }),
        };
      });
    },
    // treeList() {
    //   const treeList = [];
    //   const positions = _.groupBy(this.sparepartList, 'machinepositionname');
    //   Object.keys(positions).forEach((k) => {
    //     treeList.push({
    //       name: `Position: ${k}`,
    //       // eslint-disable-next-line arrow-body-style
    //       children: positions[k].map((item) => {
    //         return { name: `${item.sparepartname}: ${item.lower} ~ ${item.upper}` };
    //       }),
    //     });
    //   });
    //   return treeList;
    // },
  },
  async created() {
    this.planid = this.$route.params.id;
    if (this.planList.length < 1) {
      await this.getRecords();
    }
    await this.getTaskList(`?query=planid=="${this.planid}"&sortquery=createdTimestamp==-1`);
    await this.getTaskOperatorList(`?query=planid=="${this.planid}"`);
    await this.getSparepartInPlanning(`?query=planid=="${this.planid}"`);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('plan', ['setAddSparepartDialog', 'setEditSparepartDialog']),
    ...mapActions('plan', [
      'getTaskList',
      'getTaskOperatorList',
      'getRecords',
      'getSparepartInPlanning',
      'deleteRecordById',
    ]),
    jumpTo(taskid) {
      this.$router.push({ name: 'maintenance-taskdetail', params: { id: taskid } });
    },
    async deleteSparepart(_id) {
      const elementName = 'sparepartsinplanning';
      const rst = await this.deleteRecordById({
        id: _id,
        name: elementName,
      });
      if (rst) {
        this.getSparepartInPlanning(`?query=planid=="${this.planid}"`);
        this.setAlert({
          show: true,
          type: 'success',
          message: 'DELETE_SPAREPART_FOR_MAINTENANCE_PLAN',
        });
      }
      this.confirmDialog = false;
      this.toDelete = null;
    },
  },
};
</script>
<style lang="sass">
#plandetails
    display: grid
    grid-template-rows: 500px
    grid-template-columns: repeat(auto-fill, 400px)
    gap: 20px
    &:before
      height: 2px
      width: 100%
      top: calc(48px - 1px)
      left: 0
    &>.v-timeline-item
      position: relative
      display: block
      &>.v-timeline-item__body
        max-width: 100%
        top: 60px
        &>.v-card:before,&>.v-card:after
          transform: rotate(90deg)
          left: calc(50% - 10px)
          top: -16px
      &>.v-timeline-item__divider
        position: absolute
        top: 0
        left: calc(50% - 53px)
</style>
