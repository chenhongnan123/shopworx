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
          {{ $t('manualinbound.addtitle') }}
        </span>
      </v-card-title>
      <v-card-text style="height: 400px;">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-autocomplete
            class="mt-5"
            :items="warehouseList"
            outlined
            v-model="warehouse"
            :label="$t('manualinbound.general.warehouse')"
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
            :label="$t('manualinbound.general.location')"
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
            :label="$t('manualinbound.general.part')"
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
          <v-text-field
            outlined
            clearable
            :label="$t('manualinbound.header.quantity')"
            v-model="manualInboundObj.quantity"
            type="number"
            min="1"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text class="text-none" @click="dialog = false">
          {{ $t('manualinbound.general.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="!warehouse || (haslocation && !location) || !part || !manualInboundObj.quantity"
          :loading="saving"
          @click="confirmDialog = true"
        >
          {{ $t('manualinbound.general.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
     <v-dialog persistent scrollable v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title primary-title>
            <span> {{ $t('manualinbound.general.confirmheader') }} </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="confirmDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text> {{ $t('manualinbound.general.confirmmessage') }} </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="text-none" :loading="saving" @click="saveBulk">
              {{ $t('manualinbound.general.yes') }}
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
  name: 'AddManualInboundDialog',
  data() {
    return {
      confirmDialog: false,
      warehouse: null,
      location: null,
      part: null,
      manualInboundObj: {
        status: false,
      },
      rules: {
        warehouse: [(v) => !!v || 'Warehouse is required'],
        location: [(v) => !!v || 'Location is required'],
        part: [(v) => !!v || 'Part is required'],
        quantity: [(v) => !!v || 'Quantity is required', (v) => v > 0 || 'Quantity should be bigger than 0'],
      },
      saving: false,
      valid: false,
    };
  },
  computed: {
    ...mapState('manual-inbound', [
      'filter',
      'addInboundDialog',
      'warehouseList',
      'locationList',
      'partList',
      'warehouseValue',
      'locationValue',
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
        return this.addInboundDialog;
      },
      set(val) {
        this.setAddInboundDialog(val);
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
    ...mapMutations('manual-inbound', ['setAddInboundDialog']),
    ...mapActions('manual-inbound', ['createPlan', 'getRecords']),
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
    async saveBulk() {
      const {
        manualInboundObj,
        warehouse,
        location,
        part,
      } = this;
      if (this.$refs.form.validate()) {
        // prettier-ignore
        // eslint-disable-next-line max-len
        this.saving = true;
        const getAssetId = this.assets.reduce((acc, item) => acc + item.id, 0);
        const inbound = await WMSService.createInboundRecord(
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
          this.bulktypeValue[0],
          Number(manualInboundObj.quantity),
          this.userName,
          new Date().getTime(),
          getAssetId,
        );
        this.saving = false;

        // eslint-disable-next-line max-len
        if (inbound) {
          this.getRecords(this.getQuery());
          Object.keys(this.manualInboundObj).forEach((k) => {
            this.manualInboundObj[k] = '';
          });
          this.warehouse = null;
          this.location = null;
          this.part = null;
          this.setAlert({
            show: true,
            type: 'success',
            message: 'CREATE_MANUAL_INBOUND',
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
