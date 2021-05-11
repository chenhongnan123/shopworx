<template>
  <div id="manualinbound">
    <portal to="app-header">
      <span>{{ $t('manualinbound.name') }}</span>
      <!-- <v-btn icon small class="ml-4 mb-1">
        <v-icon v-text="'$info'"></v-icon>
      </v-btn>
      <v-btn icon small class="ml-2 mb-1">
        <v-icon v-text="'$settings'"></v-icon>
      </v-btn> -->
    </portal>
    <v-container fluid class="py-0">
      <div class="stick">
        <div style="float: left; margin-bottom: 10px">
          <span v-if="warehouseList.length && !!warehouseValue" class="ml-2">
            {{ $t('manualinbound.general.warehouse') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2"
              @click="setWarehouseValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px;">
                {{ warehouseValue }}
              </div>
            </v-btn>
          </span>
          <span v-if="!!locationValue" class="ml-2">
            {{ $t('manualinbound.header.location') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setLocationValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ locationValue }}
              </div>
            </v-btn>
          </span>
          <span v-if="!!partValue" class="ml-2">
            {{ $t('manualinbound.header.part') }}:
            <v-btn
              small
              color="normal"
              outlined
              class="text-none ml-2 text-truncate"
              @click="setPartValue('')"
            >
              <v-icon small left>mdi-close</v-icon>
              <div class="text-truncate" style="max-width: 100px">
                {{ partValue }}
              </div>
            </v-btn>
          </span>
        </div>
        <div style="float: right">
          <v-btn small color="primary" class="text-none" @click="setAddInboundDialog(true)">
            <v-icon small left>mdi-plus</v-icon>
            {{ $t('manualinbound.general.add') }}
          </v-btn>
          <v-btn small color="primary" outlined class="text-none ml-2" @click="RefreshUI">
            <v-icon small left>mdi-refresh</v-icon>
            {{ $t('manualinbound.general.refresh') }}
          </v-btn>
          <!-- <v-btn small color="primary" outlined class="text-none ml-2" @click="exportData">
            Export
          </v-btn> -->
          <v-btn small color="primary" outlined class="text-none ml-2" @click="toggleFilter">
            <v-icon small left>mdi-filter-variant</v-icon>
            {{ $t('manualinbound.general.filter') }}
          </v-btn>
        </div>
      </div>
      <v-data-table
        v-model="bulkrecordSelected"
        :headers="headers"
        item-key="planid"
        :items="bulkrecordList"
        :options="{ itemsPerPage: 20 }"
        dense
      >
        <template v-slot:item.name="{ item }">
          <span @click="handleClick(item)"
            ><a>{{ item.name }}</a></span
          >
        </template>
        <template v-slot:item.createdtime="{ item }">
          <span>{{
            item.createdtime ? format(new Date(Number(item.createdtime)), 'yyyy-MM-dd HH:mm') : ''
          }}</span>
        </template>
      </v-data-table>
    </v-container>
    <manual-inbound-filter />
    <add-manual-inbound />
  </div>
</template>

<script>
import { formatDate } from '@shopworx/services/util/date.service';
import { mapActions, mapState, mapMutations } from 'vuex';
import AddManualInbound from '../components/AddManualInbound.vue';
import ManualInboundFilter from '../components/ManualInboundFilter.vue';

export default {
  components: { AddManualInbound, ManualInboundFilter },
  name: 'ManualInbound',
  data() {
    return {
      format: formatDate,
      headers: [
        { text: '', value: 'numberIndex', width: 40 },
        { text: this.$t('manualinbound.header.warehousecode'), value: 'warehousecode' },
        { text: this.$t('manualinbound.header.warehousename'), value: 'warehousename' },
        { text: this.$t('manualinbound.header.locationcode'), value: 'locationcode' },
        { text: this.$t('manualinbound.header.locationname'), value: 'locationname' },
        { text: this.$t('manualinbound.header.partnumber'), value: 'partnumber' },
        { text: this.$t('manualinbound.header.partname'), value: 'partname' },
        { text: this.$t('manualinbound.header.quantity'), value: 'quantity' },
        { text: this.$t('manualinbound.header.type'), value: 'type' },
        { text: this.$t('manualinbound.header.createdby'), value: 'createdby' },
        { text: this.$t('manualinbound.header.createdtime'), value: 'createdtime' },
      ],
      bulkrecordSelected: [],
      imgpre: null,
      showprev: false,
      confirmDialog: false,
      saving: false,
    };
  },
  computed: {
    ...mapState('manual-inbound', [
      'filter',
      'addPlanDialog',
      'isApply',
      'partList',
      'bulkrecordList',
      'warehouseList',
      'locationValue',
      'warehouseValue',
      'partValue',
      'assets',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
  },
  watch: {
    locationValue(val) {
      if (!val) {
        this.setLocationValue('');
        this.getRecords(this.getQuery());
      }
    },
    warehouseValue(val) {
      if (!val) {
        this.setWarehouseValue('');
        this.getRecords(this.getQuery());
      }
    },
    partValue(val) {
      if (!val) {
        this.setPartValue('');
        this.getRecords(this.getQuery());
      }
    },
  },
  async created() {
    this.getAssets();
    this.getRecords('?query=type==1&pagenumber=1&pagesize=10');
    this.getBulkType();
    await this.getWarehouseList();
    await this.getLocationLists();
    await this.getPartLists();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('manual-inbound', [
      'toggleFilter',
      'setAddInboundDialog',
      'setApply',
      'setLocationValue',
      'setWarehouseValue',
      'setPartValue',
    ]),
    ...mapActions('manual-inbound', [
      'getRecords',
      'getWarehouseList',
      'getLocationLists',
      'getPartLists',
      'getAssets',
      'getBulkType',
    ]),
    getQuery() {
      let query = '?query=type==1';
      if (this.warehouseValue) {
        query += `%26%26warehousecode=="${this.warehouseValue}"`;
      }
      if (this.locationValue) {
        query += `%26%26locationcode=="${this.locationValue}"`;
      }
      if (this.partValue) {
        query += `%26%26partnumber=="${this.partValue}"`;
      }
      return query;
    },
    async RefreshUI() {
      await this.getRecords(this.getQuery());
    },
  },
};
</script>

<style lang="sass">
#manualinbound
  height: 100%
  width: 100%
  .stick
    width: 100%
    padding: 20px 0
    overflow: hidden
    z-index: 1
</style>
