<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        <span> {{ $t('maintenanceplan.filter') }} </span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleFilter">
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
            :label="$t('maintenanceplan.general.line')"
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
            :label="$t('maintenanceplan.general.subline')"
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
            :label="$t('maintenanceplan.general.machine')"
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
            :items="types"
            outlined
            dense
            hide-details
            v-model="type"
            :label="$t('maintenanceplan.header.type')"
            clearable
          >
          </v-autocomplete>
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          :disabled="!type && !machine"
          :loading="saving"
        >
          {{ $t('maintenanceplan.general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('maintenanceplan.general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'PlanFilter',
  data() {
    return {
      saving: false,
      types: ['TBM', 'CBM'],
    };
  },
  computed: {
    ...mapState('plan', [
      'filter',
      'lineList',
      'sublineList',
      'machineList',
      'lineValue',
      'sublineValue',
      'machineValue',
      'typeValue',
      'assets',
    ]),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    type: {
      get() {
        return this.typeValue;
      },
      set(val) {
        this.setTypeValue(val);
      },
    },
    line: {
      get() {
        return this.lineValue;
      },
      set(val) {
        this.setLineValue(val);
        const query = `?query=lineid==${val}`;
        this.getSublineList(query);
        this.setSublineValue('');
        this.setMachineValue('');
      },
    },
    subline: {
      get() {
        return this.sublineValue;
      },
      set(val) {
        this.setSublineValue(val);
        const query = `?query=sublineid=="${val}"`;
        this.getMachineList(query);
        this.setMachineValue('');
      },
    },
    machine: {
      get() {
        this.setApply(false);
        return this.machineValue;
      },
      set(val) {
        this.setApply(false);
        this.setMachineValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('plan', [
      'setFilter',
      'toggleFilter',
      'setLineValue',
      'setSublineValue',
      'setMachineValue',
      'setTypeValue',
      'setApply',
    ]),
    ...mapActions('plan', ['getRecords', 'getSublineList', 'getMachineList']),
    async btnApply() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.type) {
        query += `%26%26type=="${this.type}"`;
      }
      if (this.machine) {
        query += `%26%26machineid=="${this.machine}"`;
      }
      this.saving = true;

      await this.getRecords(query);
      this.saving = false;

      this.toggleFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getRecords('?pagenumber=1&pagesize=10');
      this.toggleFilter();
      this.type = '';
      this.line = '';
      this.subline = '';
      this.machine = '';
    },
  },
};
</script>
