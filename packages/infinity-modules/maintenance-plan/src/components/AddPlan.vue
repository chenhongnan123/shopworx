<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    id="addmaintenanceplan"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('maintenanceplan.addtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 600px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            :disabled="saving"
            :rules="rules.name"
            :label="$t('maintenanceplan.header.name')"
            v-model="planObj.name"
            clearable
          ></v-text-field>
          <v-autocomplete
            clearable
            :label="$t('maintenanceplan.header.type')"
            :items="types"
            :disabled="saving"
            v-model="planObj.type"
            :rules="rules.type"
            @change="handleType"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            :label="$t('maintenanceplan.header.machinename')"
            :items="machineList"
            :disabled="saving"
            @change="handleMachine"
            :rules="rules.machine"
            item-text="machinename"
            return-object
            v-model="selectedMachine"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
                <v-list-item-title v-text="item.machinename"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            :label="$t('maintenanceplan.header.solutionname')"
            :items="solutionList"
            :disabled="saving"
            :rules="rules.solution"
            @change="handleSolution"
            return-object
            item-text="name"
            v-model="selectedSolution"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            v-if="planObj.type === 'CBM'"
            :disabled="saving"
            :rules="rules.duration"
            :label="$t('maintenanceplan.header.duration')"
            v-model="planObj.duration"
            type="number"
          ></v-text-field>
          <!-- <v-text-field
            readonly
            v-else
            :disabled="saving"
            :rules="rules.corn"
            label="CRON*"
            v-model="planObj.cron"
            @click="cronDialog = true"
          >
          </v-text-field> -->
          <v-autocomplete
            v-else
            clearable
            :label="$t('maintenanceplan.header.cron')"
            :items="cronList"
            :disabled="saving"
            :rules="rules.corn"
            v-model="cron"
            item-text="name"
            return-object
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.cron"></v-list-item-subtitle>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-checkbox label="Enable" v-model="planObj.status"></v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('maintenanceplan.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="
            !planObj.name &&
              !planObj.type &&
              !planObj.machineid &&
              !planObj.solutionid &&
              !planObj.duration
          "
          :loading="saving"
          @click="savePlan"
        >
          {{ $t('maintenanceplan.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'AddMaintenancePlanDialog',
  data() {
    return {
      selectedMachine: null,
      selectedSolution: null,
      planObj: {
        status: false,
      },
      cron: {},
      rules: {
        name: [(v) => !!v || 'Name is required'],
        type: [(v) => !!v || 'Type is required'],
        duration: [(v) => !!v || 'Duration is required'],
        cron: [(v) => !!v || 'Cron is required'],
        machine: [(v) => !!v || 'Machine is required'],
        solution: [(v) => !!v || 'Solution is required'],
      },
      saving: false,
      valid: false,
      types: ['TBM', 'CBM'],
      cronDialog: false,
    };
  },
  computed: {
    ...mapState('plan', [
      'filter',
      'addPlanDialog',
      'machineList',
      'solutionList',
      'cronList',
      'machineValue',
      'typeValue',
      'assets',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addPlanDialog;
      },
      set(val) {
        this.setAddPlanDialog(val);
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('plan', ['setAddPlanDialog']),
    ...mapActions('plan', ['createPlan', 'getRecords']),
    getQuery() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.typeValue) {
        query += `%26%26type=="${this.typeValue}"`;
      }
      if (this.machineValue) {
        query += `%26%26machineid=="${this.machineValue}"`;
      }
      return query;
    },
    async savePlan() {
      const { planObj, cron } = this;
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        planObj.status = planObj.status ? 'enable' : 'unable';
        const payload = {
          ...planObj,
          cron: cron.cron,
          cronname: cron.name,
          assetid: getAssetId,
          createdby: this.userName,
          createdtime: new Date().getTime(),
          starttrigger:
            planObj.status === 'enable' ? formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') : null,
        };
        this.saving = true;
        const solution = await this.createPlan(payload);
        this.saving = false;

        // eslint-disable-next-line max-len
        if (solution) {
          this.getRecords(this.getQuery());
          Object.keys(this.planObj).forEach((k) => {
            this.planObj[k] = '';
          });
          this.selectedMachine = null;
          this.selectedSolution = null;
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_MAINTENANCE_PLAN',
          });
        }
        this.dialog = false;
      }
    },
    handleSolution(item) {
      if (item) {
        this.planObj.solutionid = item.id;
        this.planObj.solutionname = item.name;
        this.planObj.solutiontype = item.type;
      }
    },
    handleMachine(item) {
      if (item) {
        this.planObj.machineid = item.id;
        this.planObj.machinename = item.machinename;
        this.planObj.machinecode = item.machinecode;
      }
    },
    handleType(item) {
      if (item) {
        this.planObj.unit = item === 'TBM' ? 'day' : 'count';
      }
    },
    confirmCron() {
      if (this.cron.result) {
        this.planObj.cron = this.cron.express;
        this.cronDialog = false;
      }
    },
  },
};
</script>
<style lang="sass">
#clicktoupload
  margin: 0 auto
  border: 2px dashed #00bcd4
  cursor: pointer
  height: 200px
  width: 200px
  line-height: 200px
  text-align: center
</style>
