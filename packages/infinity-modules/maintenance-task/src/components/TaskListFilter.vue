<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer
    width="300px"
    absolute
    right
    :overlay-opacity="0"
    temporary
    v-model="showFilter"
  >
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        {{ $t('maintenancetask.filter.title') }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleListFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <!-- <v-autocomplete
            class="mt-5"
            :items="lineList"
            outlined
            dense
            hide-details
            v-model="line"
            name="name"
            :label="$t('maintenancetask.general.line')"
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
            :label="$t('maintenancetask.general.subline')"
            item-text="name"
            item-value="id"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete> -->
          <v-autocomplete
            class="mt-5"
            :items="machineList"
            outlined
            dense
            hide-details
            v-model="machine"
            name="name"
            :label="$t('maintenancetask.general.machine')"
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
            :items="types"
            outlined
            dense
            hide-details
            v-model="type"
            :label="$t('maintenancetask.filter.type')"
            clearable
          >
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="statuses"
            outlined
            dense
            hide-details
            v-model="status"
            :label="$t('maintenancetask.filter.status')"
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
            :disabled="saving"
            :label="$t('maintenancetask.filter.startdate')"
            v-model="startdate"
            type="date"
            outlined
            dense
            clearable
          ></v-text-field>
          <v-text-field
            :disabled="saving"
            :label="$t('maintenancetask.filter.enddate')"
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
            !listtypeValue &&
              !listmachineValue &&
              !liststatusValue &&
              !startdateValue &&
              !enddateValue
          "
          :loading="saving"
        >
          {{ $t('maintenancetask.general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('maintenancetask.general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { dayStart, dayEnd } from '@shopworx/services/util/date.service';

export default {
  name: 'TaskListFilter',
  data() {
    return {
      saving: false,
      types: ['TBM', 'CBM', 'PM'],
      menu: false,
      statuses: ['new', 'assigned', 'in progress', 'completed'],
    };
  },
  computed: {
    ...mapState('task', [
      'listfilter',
      'lineList',
      'sublineList',
      'machineList',
      'listlineValue',
      'listsublineValue',
      'listmachineValue',
      'listtypeValue',
      'monthValue',
      'liststatusValue',
      'startdateValue',
      'enddateValue',
    ]),
    showFilter: {
      get() {
        return this.listfilter;
      },
      set(val) {
        this.setListFilter(val);
      },
    },
    type: {
      get() {
        return this.listtypeValue;
      },
      set(val) {
        this.setListTypeValue(val);
      },
    },
    status: {
      get() {
        return this.liststatusValue;
      },
      set(val) {
        this.setListStatusValue(val);
      },
    },
    date: {
      get() {
        return this.monthValue;
      },
      set(val) {
        this.setMonthValue(val);
      },
    },
    line: {
      get() {
        return this.listlineValue;
      },
      set(val) {
        this.setListLineValue(val);
        const query = `?query=lineid==${val}`;
        this.getSublineList(query);
        this.setListSublineValue('');
        this.setListMachineValue('');
      },
    },
    subline: {
      get() {
        return this.listsublineValue;
      },
      set(val) {
        this.setListSublineValue(val);
        const query = `?query=sublineid=="${val}"`;
        this.getMachineList(query);
        this.setListMachineValue('');
      },
    },
    machine: {
      get() {
        return this.listmachineValue;
      },
      set(val) {
        this.setListMachineValue(val);
      },
    },
    startdate: {
      get() {
        return this.startdateValue;
      },
      set(val) {
        this.setStartdateValue(val);
      },
    },
    enddate: {
      get() {
        return this.enddateValue;
      },
      set(val) {
        this.setEnddateValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('task', [
      'setListFilter',
      'toggleListFilter',
      'setListLineValue',
      'setListSublineValue',
      'setListMachineValue',
      'setListTypeValue',
      'setApply',
      'setMonthValue',
      'setListStatusValue',
      'setStartdateValue',
      'setEnddateValue',
    ]),
    ...mapActions('task', ['getRecords', 'getSublineList', 'getMachineList']),
    async btnApply() {
      let query = '?query=assetId!=-1';
      if (this.startdate) {
        const start = new Date(dayStart(new Date(this.startdate))).getTime();
        query += `%26%26planendtime>${start}`;
      }
      if (this.enddate) {
        const end = new Date(dayEnd(new Date(this.enddate))).getTime();
        query += `%26%26planstarttime<${end}`;
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
        query = '';
      }
      this.saving = true;

      await this.getRecords(query);
      this.saving = false;

      this.toggleListFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getRecords('');
      this.toggleListFilter();
      this.type = '';
      this.line = '';
      this.subline = '';
      this.machine = '';
      this.date = '';
      this.status = '';
    },
  },
};
</script>
