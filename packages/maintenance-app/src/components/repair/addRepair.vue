<template>
  <v-dialog
    id="updatereplacement"
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('repair.addtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 220px;">
        <v-form class="mt-5" ref="form" lazy-validation>
          <v-autocomplete
            clearable
            :label="$t('repair.repairheader.machinename')"
            :disabled="saving"
            :items="machineList"
            return-object
            item-text="machinename"
            outlined
            v-model="machine"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle>{{ item.machinecode }}</v-list-item-subtitle>
                <v-list-item-title>{{ item.machinename }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            clearable
            :label="$t('repair.repairheader.fault')"
            :disabled="saving"
            :items="faultList"
            return-object
            item-text="name"
            outlined
            v-model="fault"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                <v-list-item-title>{{ item.code }}: {{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!machine || !fault"
          class="text-none"
          :loading="saving"
          @click="addNewRepair"
        >
          {{ $t('general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { dayStart, dayEnd } from '@shopworx/services/util/date.service';

export default {
  name: 'AddNewRepair',
  data() {
    return {
      operatorObj: {},
      machine: null,
      fault: null,
      rules: {
        name: [(v) => !!v || 'Name is required'],
        department: [(v) => !!v || 'Department is required'],
        position: [(v) => !!v || 'Position is required'],
        code: [(v) => !!v || 'Badage Code is required'],
      },
      saving: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('auth', ['operator']),
    ...mapState('maintenance', [
      'addRepairDialog',
      'machineList',
      'faultList',
      'repairmachineValue',
      'repairstatusValue',
      'repairstartdateValue',
      'repairenddateValue',
    ]),
    dialog: {
      get() {
        return this.addRepairDialog;
      },
      set(val) {
        this.setAddRepairDialog(val);
      },
    },
    userName: {
      get() {
        return this.operator.operatorname;
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('maintenance', ['setAddRepairDialog']),
    ...mapActions('maintenance', ['getRepairByQuery', 'createRepair']),
    async addNewRepair() {
      const { machine, fault } = this;
      if (this.$refs.form.validate()) {
        const payload = {
          machineid: machine.id,
          machinecode: machine.machinecode,
          machinename: machine.machinename,
          faultid: fault.id,
          faultcode: fault.code,
          faultname: fault.name,
          faultdescription: fault.description,
          createdby: this.userName,
          createdtime: new Date().getTime(),
          status: 'new',
        };
        this.saving = true;
        const repair = await this.createRepair(payload);
        this.saving = false;
        if (repair) {
          this.getRepairByQuery(this.getQuery());
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_REPAIR',
          });
          this.$refs.form.reset();
        }
        this.dialog = false;
      }
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
        query = '';
      }
      return query;
    },
  },
};
</script>
