<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer
    width="300px"
    absolute
    right
    :overlay-opacity="0"
    temporary
    v-model="showFilter"
    v-if="showFilter"
  >
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        {{ $t('repair.filter.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleRepairFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 180px)">
          <v-autocomplete
            class="mt-5"
            :items="lineList"
            outlined
            dense
            hide-details
            v-model="line"
            name="name"
            :label="$t('general.line')"
            item-text="name"
            item-value="id"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="sublineList"
            outlined
            dense
            hide-details
            v-model="subline"
            name="name"
            :label="$t('general.subline')"
            item-text="name"
            item-value="id"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="machineList"
            outlined
            dense
            hide-details
            v-model="machine"
            name="name"
            :label="$t('general.machine')"
            item-text="machinename"
            item-value="id"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.machinename"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="statuses"
            outlined
            dense
            hide-details
            v-model="status"
            :label="$t('repair.filter.status')"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item" class="text-capitalize"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-text-field
            class="mt-5"
            v-if="status == 'completed'"
            :disabled="saving"
            :label="$t('repair.filter.startdate')"
            v-model="startdate"
            type="date"
            outlined
            dense
            clearable
          ></v-text-field>
          <v-text-field
            v-if="status == 'completed'"
            :disabled="saving"
            :label="$t('repair.filter.enddate')"
            v-model="enddate"
            type="date"
            outlined
            dense
            clearable
          ></v-text-field>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          :disabled="
            !repairmachineValue &&
              !repairstatusValue &&
              !repairstartdateValue &&
              !repairenddateValue
          "
          :loading="saving"
        >
          {{ $t('general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { dayStart, dayEnd } from '@shopworx/services/util/date.service';

export default {
  name: 'RepairFilter',
  data() {
    return {
      saving: false,
      menu: false,
      statuses: ['new', 'in progress', 'completed', 'close'],
    };
  },
  computed: {
    ...mapState('maintenance', [
      'repairfilter',
      'lineList',
      'sublineList',
      'machineList',
      'repairlineValue',
      'repairsublineValue',
      'repairmachineValue',
      'repairstatusValue',
      'repairstartdateValue',
      'repairenddateValue',
    ]),
    showFilter: {
      get() {
        return this.repairfilter;
      },
      set(val) {
        this.setRepairFilter(val);
      },
    },
    status: {
      get() {
        return this.repairstatusValue;
      },
      set(val) {
        this.setRepairStatusValue(val);
        this.setRepairStartdateValue(null);
        this.setRepairEnddateValue(null);
      },
    },
    line: {
      get() {
        return this.listlineValue;
      },
      set(val) {
        this.setRepairLineValue(val);
        const query = `?query=lineid==${val}`;
        this.getSublineList(query);
        this.setRepairSublineValue('');
        this.setRepairMachineValue('');
      },
    },
    subline: {
      get() {
        return this.listsublineValue;
      },
      set(val) {
        this.setRepairSublineValue(val);
        const query = `?query=sublineid=="${val}"`;
        this.getMachineList(query);
        this.setRepairMachineValue('');
      },
    },
    machine: {
      get() {
        return this.repairmachineValue;
      },
      set(val) {
        this.setRepairMachineValue(val);
      },
    },
    startdate: {
      get() {
        return this.repairstartdateValue;
      },
      set(val) {
        this.setRepairStartdateValue(val);
      },
    },
    enddate: {
      get() {
        return this.repairenddateValue;
      },
      set(val) {
        this.setRepairEnddateValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('maintenance', [
      'setRepairFilter',
      'toggleRepairFilter',
      'setRepairLineValue',
      'setRepairSublineValue',
      'setRepairMachineValue',
      'setApply',
      'setRepairStatusValue',
      'setRepairStartdateValue',
      'setRepairEnddateValue',
    ]),
    ...mapActions('maintenance', ['getRepairByQuery', 'getSublineList', 'getMachineList']),
    async btnApply() {
      let query = '?query=status!="assigned"';
      if (this.startdate) {
        const start = new Date(dayStart(new Date(this.startdate))).getTime();
        query += `%26%26endtime>=${start}`;
      }
      if (this.enddate) {
        const end = new Date(dayEnd(new Date(this.enddate))).getTime();
        query += `%26%26starttime<=${end}`;
      }
      if (this.type) {
        query += `%26%26type=="${this.type}"`;
      }
      if (this.machine) {
        query += `%26%26machineid=="${this.machine}"`;
      }
      if (this.status) {
        query += `%26%26status=="${this.status}"`;
      }
      if (!this.startdate && !this.enddate && !this.type && !this.machine && !this.status) {
        query = '?pagenumber=1&pagesize=10';
      }
      this.saving = true;

      await this.getRepairByQuery(query);
      this.saving = false;

      this.toggleRepairFilter();
    },
    btnReset() {
      this.getRepairByQuery('?query=status!="assigned"&pagenumber=1&pagesize=10');
      this.toggleRepairFilter();
      this.line = '';
      this.subline = '';
      this.machine = '';
      this.status = '';
      this.startdate = '';
      this.enddate = '';
    },
  },
};
</script>
