<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        Operator filters
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
            :items="departmentList"
            outlined
            dense
            hide-details
            v-model="department"
            name="name"
            :label="$t('operator.general.department')"
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
            :items="positionList"
            outlined
            dense
            hide-details
            v-model="position"
            name="name"
            :label="$t('operator.general.position')"
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
          :disabled="!departmentValue && !positionValue"
          :loading="saving"
        >
          {{ $t('operator.general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('operator.general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'OperatorFilter',
  data() {
    return {
      saving: false,
    };
  },
  computed: {
    ...mapState('operator', [
      'filter',
      'departmentList',
      'positionList',
      'departmentValue',
      'positionValue',
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
    department: {
      get() {
        return this.departmentValue;
      },
      set(val) {
        this.setDepartmentValue(val);
      },
    },
    position: {
      get() {
        return this.positionValue;
      },
      set(val) {
        this.setPositionValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('operator', [
      'setFilter',
      'toggleFilter',
      'setDepartmentValue',
      'setPositionValue',
      'setApply',
    ]),
    ...mapActions('operator', [
      'updateOperator',
      'deleteOperator',
      'createOperator',
      'createOperatorList',
      'getDepartments',
      'getPositions',
      'getRecords',
    ]),
    async btnApply() {
      const getAssetId = this.assets
        .filter((item) => item.status === 'ACTIVE')
        .reduce((acc, item) => acc + item.id, 0);
      let query = `?query=assetid==${getAssetId}||assetid==0`;
      if (this.position) {
        query += `%26%26positionid=="${this.position}"`;
      }
      if (this.department) {
        query += `%26%26departmentid=="${this.department}"`;
      }
      this.saving = true;

      await this.getRecords(query);
      this.saving = false;

      this.toggleFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getRecords('');
      this.toggleFilter();
      this.department = '';
      this.position = '';
    },
  },
};
</script>
