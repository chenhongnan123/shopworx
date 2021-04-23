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
      <v-btn icon @click="toggleCalendarFilter">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card flat>
      <perfect-scrollbar>
        <v-card-text style="height:calc(100vh - 220px)">
          <v-autocomplete
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
          </v-autocomplete>
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
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="mt-5"
                v-model="date"
                :label="$t('maintenancetask.filter.month')"
                readonly
                v-bind="attrs"
                v-on="on"
                outlined
                dense
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" type="month" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                {{ $t('maintenancetask.general.cancel') }}
              </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                {{ $t('maintenancetask.general.yes') }}
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          :disabled="!date"
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
import { monthStart, monthEnd } from '@shopworx/services/util/date.service';

export default {
  name: 'TaskCalendarFilter',
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
      'calendarfilter',
      'lineList',
      'sublineList',
      'machineList',
      'calendarlineValue',
      'calendarsublineValue',
      'calendarmachineValue',
      'calendartypeValue',
      'monthValue',
      'calendarstatusValue',
    ]),
    showFilter: {
      get() {
        return this.calendarfilter;
      },
      set(val) {
        this.setCalendarFilter(val);
      },
    },
    type: {
      get() {
        return this.calendartypeValue;
      },
      set(val) {
        this.setCalendarTypeValue(val);
      },
    },
    status: {
      get() {
        return this.calendarstatusValue;
      },
      set(val) {
        this.setCalendarStatusValue(val);
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
        return this.calendarlineValue;
      },
      set(val) {
        this.setCalendarLineValue(val);
        const query = `?query=lineid==${val}`;
        this.getSublineList(query);
        this.setCalendarSublineValue('');
        this.setCalendarMachineValue('');
      },
    },
    subline: {
      get() {
        return this.calendarsublineValue;
      },
      set(val) {
        this.setCalendarSublineValue(val);
        const query = `?query=sublineid=="${val}"`;
        this.getMachineList(query);
        this.setCalendarMachineValue('');
      },
    },
    machine: {
      get() {
        this.setApply(false);
        return this.calendarmachineValue;
      },
      set(val) {
        this.setApply(false);
        this.setCalendarMachineValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('task', [
      'setCalendarFilter',
      'toggleCalendarFilter',
      'setCalendarLineValue',
      'setCalendarSublineValue',
      'setCalendarMachineValue',
      'setCalendarTypeValue',
      'setApply',
      'setMonthValue',
      'setCalendarStatusValue',
    ]),
    ...mapActions('task', ['getCalendarRecords', 'getSublineList', 'getMachineList']),
    async btnApply() {
      let query = '?query=assetId!=-1';
      const start = new Date(monthStart(new Date(this.date))).getTime();
      const end = new Date(monthEnd(new Date(this.date))).getTime();
      query += `%26%26planstarttime<${end}`;
      query += `%26%26planendtime>${start}`;
      if (this.type) {
        query += `%26%26type=="${this.type}"`;
      }
      if (this.machine) {
        query += `%26%26machineid=="${this.machine}"`;
      }
      if (this.status) {
        query += `%26%26status=="${this.status}"`;
      }
      this.saving = true;

      await this.getCalendarRecords(query);
      this.setMonthValue(this.date);
      this.saving = false;

      this.toggleCalendarFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getCalendarRecords('?pagenumber=1&pagesize=10');
      this.toggleCalendarFilter();
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
