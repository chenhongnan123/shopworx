<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          Create Order
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          clearable
          label="Select Product Name"
          :items="parts"
          return-object
          :disabled="saving"
          item-text="productname"
          v-model="selectedPart"
          :loading="loadingParts"
          prepend-icon="$production"
          @change="onPartSelection(selectedPart)"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.productname"></v-list-item-title>
              <v-list-item-subtitle v-text="item.productnumber"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-text-field
            :disabled="saving"
            label="Order Name"
            prepend-icon="mdi-tray-plus"
            v-model="plan.ordername"
        ></v-text-field>
        <v-autocomplete
          clearable
          label="Select Order Type"
          :items="orderTypeList"
          :disabled="saving"
          item-text="name"
          v-model="plan.ordertype"
          :loading="loadingParts"
          prepend-icon="$production"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-text-field
            :disabled="true"
            label="Customer"
            prepend-icon="mdi-tray-plus"
            v-model="plan.customername"
        ></v-text-field>
        <template v-if="selectedPart">
          <template v-if="fetchingPartMatrix">
            <span class="ml-8">
              Fetching selected product records...
            </span>
          </template>
          <template v-else>
            <template v-if="displayPlanningFields">
              <v-text-field
                :disabled="true"
                label="Roadmap name"
                prepend-icon="mdi-tray-plus"
                v-model="plan.roadmapname"
              ></v-text-field>
              <v-text-field
                type="number"
                :disabled="saving"
                label="Target quantity"
                prepend-icon="mdi-tray-plus"
                v-model="plan.targetcount"
              ></v-text-field>
              <v-text-field
                type="datetime-local"
                v-model="plan.scheduledstart"
                label="Scheduled start"
                prepend-icon="mdi-clock-start"
              ></v-text-field>
            </template>
          </template>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="text-none"
          :loading="saving"
          @click="saveOrder"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';

export default {
  name: 'AddOrder',
  data() {
    return {
      plan: {},
      assetId: null,
      filters: {},
      isFamily: false,
      saving: false,
      message: null,
      partTag: null,
      showMore: false,
      selectedPart: null,
      loadingParts: false,
      partMatrix: {},
      familyParts: [],
      familyPlan: [],
      showFamilyParts: false,
      partMatrixRecords: [],
      essentialMatrixTags: [],
      fetchingPartMatrix: false,
      displayPlanningFields: false,
      getLastInserTedData: [],
      myResult: [],
      dateValue: '',
    };
  },
  computed: {
    ...mapState('orderManagement', ['parts', 'orderTypeList', 'addPlanDialog', 'primaryMatrixTags', 'orderList']),
    ...mapGetters('orderManagement', [
      'planningTags',
      'partMatrixTags',
      'filteredPartMatrixRecords',
      'partMatrixComposition',
    ]),
    dialog: {
      get() {
        return this.addPlanDialog;
      },
      set(val) {
        this.setAddPlanDialog(val);
      },
    },
  },
  async created() {
    this.loadingParts = true;
    await this.getPorducts();
    await this.getOrderTypeList();
    this.loadingParts = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('orderManagement', ['setAddPlanDialog']),
    ...mapActions('orderManagement', [
      'getPorducts',
      'getOrderTypeList',
      'getOrderRecords',
      'createOrder',
      'createFamilyPlan',
      'isFamilyMold',
      'getFamilyParts',
      'getPorductRecords',
      'getPrimaryMatrixTags',
      'getScheduledEnd',
    ]),
    async onPartSelection() {
      this.plan = {};
      this.plan.starred = false;
      this.partMatrix = {};
      this.filters = {};
      this.familyPlan = [];
      this.showFamilyParts = false;
      this.displayPlanningFields = false;
      if (this.selectedPart) {
        const { assetid } = this.selectedPart;
        const { productname } = this.selectedPart;
        this.assetId = assetid;
        this.fetchingPartMatrix = true;
        await this.getPorductRecords(this.selectedPart);
        this.partMatrixRecords = this.filteredPartMatrixRecords();
        this.fetchingPartMatrix = false;
        this.plan.productname = productname;
        this.plan.roadmapname = this.partMatrixRecords[0].roadmapname;
        this.plan.customername = this.partMatrixRecords[0].customername;
        this.plan.producttype = this.partMatrixRecords[0].producttype;
        this.displayPlanningFields = true;
      }
    },
    isExpired(expiryDate) {
      return Date.now() < (new Date(expiryDate).getTime());
    },
    async saveOrder() {
      if (!this.plan.ordername) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ORDER_NAME_EMPTY',
        });
      } else if (!this.isExpired(this.plan.scheduledstart)) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ORDER_PAST_DATE',
        });
      } else {
        const orderNameFlag = this.orderList.filter((o) => o.ordername === this.plan.ordername);
        if (orderNameFlag.length > 0) {
          this.plan.ordername = '';
          this.setAlert({
            show: true,
            type: 'error',
            message: 'ALREADY_EXSIST',
          });
        } else {
          this.getLastInserTedData = await this.getOrderRecords('');
          if (this.getLastInserTedData.length > 0) {
            const orderNumer = this.getLastInserTedData[0].ordernumber;
            this.myResult = orderNumer.split('-');
          }
          this.saving = true;
          const expCycleTime = 23456;
          const targetCount = this.plan.targetcount * expCycleTime;
          this.plan.orderexpendtime = new Date(this.plan.scheduledstart).getTime() + targetCount;
          this.plan.scheduledend = new Date(this.plan.scheduledstart).getTime() + targetCount;
          this.plan.actualcount = 0;
          this.plan.okcount = 0;
          this.plan.ngcount = 0;
          if (this.myResult.length > 0) {
            this.plan.indexno = (Number(this.myResult[1]) + 1) * 100;
          } else {
            this.plan.indexno = 100;
          }
          this.plan = {
            ...this.plan,
            orderstatus: 'New',
            assetid: this.assetId,
            scheduledstart: new Date(this.plan.scheduledstart).getTime(),
            ordercreatedtime: new Date().getTime(),
          };
          let created = false;
          const payload = this.plan;
          created = await this.createOrder(payload);
          if (created) {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'ORDER_CREATED',
            });
            this.dialog = false;
            this.selectedPart = null;
            this.assetId = null;
            this.partMatrix = {};
            this.plan = {};
            this.showFamilyParts = false;
            this.displayPlanningFields = false;
            this.familyPlan = [];
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_PLAN',
            });
          }
          this.saving = false;
        }
      }
    },
  },
};
</script>
