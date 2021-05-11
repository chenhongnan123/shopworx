<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        {{ $t('machine.filter.title') }}
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
            :label="$t('machine.general.line')"
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
            :label="$t('machine.general.subline')"
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
        </v-card-text>
      </perfect-scrollbar>
      <v-card-actions>
        <v-btn
          class="text-none"
          color="primary"
          @click="btnApply"
          :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
          :disabled="!lineValue && !sublineValue"
          :loading="saving"
        >
          {{ $t('machine.general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('machine.general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'MachineFilter',
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    ...mapState('machine', [
      'filter',
      'lineList',
      'sublineList',
      'lineValue',
      'sublineValue',
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
    line: {
      get() {
        return this.lineValue;
      },
      set(val) {
        this.setLineValue(val);
        const query = `?query=lineid==${val}`;
        this.getSublines(query);
        this.setSublineValue('');
      },
    },
    subline: {
      get() {
        return this.sublineValue;
      },
      set(val) {
        this.setSublineValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('machine', [
      'setFilter',
      'toggleFilter',
      'setLineValue',
      'setSublineValue',
      'setApply',
    ]),
    ...mapActions('machine', [
      'updateMachine',
      'deleteMachine',
      'createMachine',
      'createMachineList',
      'getLines',
      'getSublines',
      'getRecords',
    ]),
    btnReset() {
      this.getRecords('?pagenumber=1&pagesize=10');
      this.toggleFilter();
      this.line = '';
      this.subline = '';
    },
    async btnApply() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.line) {
        query += `%26%26lineid==${this.line}`;
      }
      if (this.subline) {
        query += `%26%26sublineid=="${this.subline}"`;
      }
      this.saving = true;

      await this.getRecords(query);
      this.saving = false;

      this.toggleFilter();
      this.setApply(true);
    },
  },
};
</script>
