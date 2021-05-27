<template>
  <!-- eslint-disable max-len -->
  <v-navigation-drawer absolute right :overlay-opacity="0" temporary v-model="showFilter">
    <v-toolbar flat :color="$vuetify.theme.dark ? '#1E1E1E' : 'white'">
      <v-toolbar-title>
        <span> {{ $t('stocktaking.filter') }} </span>
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
            :items="warehouseList"
            outlined
            dense
            hide-details
            v-model="warehouse"
            name="name"
            :label="$t('stocktaking.general.warehouse')"
            item-text="warehousename"
            item-value="warehousecode"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.warehousename"></v-list-item-title>
                <v-list-item-subtitle v-text="item.warehousecode"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="locationList"
            outlined
            dense
            hide-details
            v-if="warehouse && haslocation"
            v-model="location"
            name="name"
            :label="$t('stocktaking.general.location')"
            item-text="locationname"
            item-value="locationcode"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.locationname"></v-list-item-title>
                <v-list-item-subtitle v-text="item.locationcode"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="partList"
            outlined
            dense
            hide-details
            v-model="part"
            name="name"
            :label="$t('stocktaking.general.part')"
            item-text="name"
            item-value="code"
            clearable
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle v-text="item.code"></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
          <v-autocomplete
            class="mt-5"
            :items="types"
            dense
            outlined
            v-model="type"
            :label="$t('stocktaking.header.type')"
            item-text="text"
            item-value="value"
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
          :disabled="!warehouse && !location && !part && !type"
          :loading="saving"
        >
          {{ $t('stocktaking.general.apply') }}
        </v-btn>
        <v-btn class="text-none" color="primary" @click="btnReset" text>
          {{ $t('stocktaking.general.reset') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  name: 'StockTakingFilter',
  data() {
    return {
      saving: false,
      stockTakingObj: {
        type: null,
      },
      types: [
        {
          text: this.$t('stocktaking.general.inbound'),
          value: 3,
        },
        {
          text: this.$t('stocktaking.general.outbound'),
          value: 4,
        },
      ],
    };
  },
  computed: {
    ...mapState('stock-taking', [
      'assets',
      'filter',
      'lineList',
      'warehouseList',
      'locationList',
      'partList',
      'warehouseValue',
      'locationValue',
      'partValue',
      'typeValue',
    ]),
    showFilter: {
      get() {
        return this.filter;
      },
      set(val) {
        this.setFilter(val);
      },
    },
    part: {
      get() {
        return this.partValue;
      },
      set(val) {
        this.setPartValue(val);
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
    warehouse: {
      get() {
        return this.warehouseValue;
      },
      set(val) {
        this.setWarehouseValue(val);
        const query = `?query=warehousecode=="${val}"`;
        this.getLocationLists(query);
        this.setLocationValue('');
      },
    },
    haslocation() {
      let ifhaslocation = false;
      if (this.warehouse) {
        const warehouseObj = this.warehouseList.filter(
          (item) => item.warehousecode === this.warehouse,
        );
        if (warehouseObj.length) {
          ifhaslocation = warehouseObj[0].haslocation;
        }
      }
      return ifhaslocation;
    },
    location: {
      get() {
        return this.locationValue;
      },
      set(val) {
        this.setLocationValue(val);
      },
    },
  },
  methods: {
    ...mapMutations('stock-taking', [
      'setFilter',
      'toggleFilter',
      'setWarehouseValue',
      'setLocationValue',
      'setPartValue',
      'setTypeValue',
      'setApply',
    ]),
    ...mapActions('stock-taking', ['getRecords', 'getWarehouseList', 'getLocationLists']),
    async btnApply() {
      let query = '?query=quantity>0';
      if (this.warehouse) {
        query += `%26%26warehousecode=="${this.warehouse}"`;
      }
      if (this.location) {
        query += `%26%26locationcode=="${this.location}"`;
      }
      if (this.part) {
        query += `%26%26partnumber=="${this.part}"`;
      }
      if (this.type) {
        query += `%26%26type==${this.type}`;
      } else {
        query += '%26%26type==3||type==4';
      }
      this.saving = true;

      await this.getRecords(query);
      this.saving = false;

      this.toggleFilter();
      this.setApply(true);
    },
    btnReset() {
      this.getRecords('?query=type==2&pagenumber=1&pagesize=10');
      this.toggleFilter();
      this.warehouse = '';
      this.location = '';
    },
  },
};
</script>
