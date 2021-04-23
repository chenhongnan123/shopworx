<template>
  <!-- eslint-disable max-len -->
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="primary">
        <span class="white--text">
          {{ $t('stocktaking.addtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 470px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete
            class="mt-5"
            :items="warehouseList"
            outlined
            v-model="warehouse"
            :label="$t('stocktaking.general.warehouse')"
            item-text="warehousename"
            item-value="warehousecode"
            return-object
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
            :items="locationList.filter(item => item.warehousecode == warehouse.warehousecode)"
            return-object
            outlined
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
            :items="partList"
            outlined
            return-object
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
            :items="types"
            outlined
            v-model="stockTakingObj.type"
            :label="$t('stocktaking.header.type')"
            item-text="text"
            item-value="value"
            clearable
          >
          </v-autocomplete>
          <v-text-field
            outlined
            clearable
            :label="$t('stocktaking.header.quantity')"
            v-model="stockTakingObj.quantity"
            min="1"
            type="number"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('stocktaking.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!warehouse || (haslocation && !location) || !part || !stockTakingObj.quantity"
          :loading="saving"
          @click="confirmDialog = true"
        >
          {{ $t('stocktaking.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
     <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title primary-title>
            <span> {{ $t('stocktaking.general.confirmheader') }} </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text> {{ $t('stocktaking.general.confirmmessage') }} </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="text-none" :loading="saving" @click="saveBulk">
              {{ $t('stocktaking.general.yes') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-dialog>
</template>
<script>
import {
  mapActions,
  mapState,
  // mapGetters,
  mapMutations,
} from 'vuex';
import WMSService from '@shopworx/services/api/wms.service';

export default {
  name: 'AddStockTakingDialog',
  data() {
    return {
      confirmDialog: false,
      warehouse: null,
      location: null,
      part: null,
      stockTakingObj: {
        status: false,
        type: null,
      },
      rules: {
        warehouse: [(v) => !!v || 'Warehouse is required'],
        location: [(v) => !!v || 'Location is required'],
        part: [(v) => !!v || 'Part is required'],
        quantity: [(v) => !!v || 'Quantity is required', (v) => v > 0 || 'Quantity should be bigger than 0'],
      },
      saving: false,
      valid: false,
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
      'filter',
      'addStockTakingDialog',
      'warehouseList',
      'locationList',
      'partList',
      'warehouseValue',
      'locationValue',
      'typeValue',
      'partValue',
      'assets',
      'bulktypeValue',
    ]),
    ...mapState('user', ['me']),
    userName: {
      get() {
        return this.me.user.firstname + this.me.user.lastname;
      },
    },
    dialog: {
      get() {
        return this.addStockTakingDialog;
      },
      set(val) {
        this.setAddStockTakingDialog(val);
      },
    },
    haslocation() {
      let ifhaslocation = false;
      if (this.warehouse) {
        ifhaslocation = this.warehouse.haslocation;
      }
      return ifhaslocation;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('stock-taking', ['setAddStockTakingDialog']),
    ...mapActions('stock-taking', ['createPlan', 'getRecords', 'getLocationLists']),
    getQuery() {
      let query = '?query=quantity>0';
      if (this.warehouseValue) {
        query += `%26%26warehousecode=="${this.warehouseValue}"`;
      }
      if (this.locationValue) {
        query += `%26%26locationcode=="${this.locationValue}"`;
      }
      if (this.partValue) {
        query += `%26%26partnumber=="${this.partValue}"`;
      }
      if (this.typeValue) {
        query += `%26%26type==${this.typeValue}`;
      } else {
        query += '%26%26type==3||type==4';
      }
      return query;
    },
    async saveBulk() {
      const {
        stockTakingObj,
        warehouse,
        location,
        part,
      } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        this.saving = true;
        const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
        let response = '';
        if (stockTakingObj.type === 3) {
          response = await WMSService.createInboundRecord(
            warehouse,
            location
            || {
              locationcode: '',
              locationname: '',
            },
            {
              partname: part.name,
              partnumber: part.code,
            },
            this.bulktypeValue.filter((item) => item.key === 3)[0],
            Number(stockTakingObj.quantity),
            this.userName,
            new Date().getTime(),
            getAssetId,
          );
        } else {
          response = await WMSService.createOutboundRecord(
            warehouse,
            location
            || {
              locationcode: '',
              locationname: '',
            },
            {
              partname: part.name,
              partnumber: part.code,
            },
            this.bulktypeValue.filter((item) => item.key === 4)[0],
            Number(stockTakingObj.quantity),
            this.userName,
            new Date().getTime(),
            getAssetId,
          );
        }
        this.saving = false;

        // eslint-disable-next-line max-len
        if (response) {
          this.getRecords(this.getQuery());
          Object.keys(this.stockTakingObj).forEach((k) => {
            this.stockTakingObj[k] = '';
          });
          this.warehouse = null;
          this.location = null;
          this.part = null;
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_STOCK_TAKING',
          });
        }
        this.dialog = false;
        this.confirmDialog = false;
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
