<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation>
    <v-card>
      <v-card-title primary-title>
        <span>
          {{ $t('Create Order') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          clearable
          :label="$t('Select Line')"
          :items="lineList"
          return-object
          :disabled="saving"
          item-text="name"
          v-model="selectedLine"
          :loading="loadingParts"
          prepend-icon="$production"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
              <v-list-item-subtitle v-text="item.id"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-autocomplete
          clearable
          :label="$t('Select Product Name')"
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
            :label="$t('Order Name')"
            prepend-icon="mdi-tray-plus"
            :counter="10"
            :rules="nameRules"
            v-model="plan.ordername"
        ></v-text-field>
        <v-autocomplete
          clearable
          :label="$t('Order Type')"
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
            :label="$t('Customer')"
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
                :label="$t('Roadmap name')"
                prepend-icon="mdi-tray-plus"
                v-model="plan.roadmapname"
              ></v-text-field>
              <v-text-field
                type="number"
                :disabled="saving"
                :label="$t('Target quantity')"
                prepend-icon="mdi-tray-plus"
                v-model="plan.targetcount"
              ></v-text-field>
              <v-text-field
                type="datetime-local"
                v-model="plan.scheduledstart"
                :label="$t('Scheduled start')"
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
          :disabled="!valid"
          @click="saveOrder"
        >
          {{ $t('Save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
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
      selectedLine: null,
      valid: true,
      btnDisable: false,
      nameRules: [(v) => !/[^a-zA-Z0-9]/.test(v) || 'Special Characters not Allowed',
        (v) => !!v || 'Name required',
        (v) => (v && v.length <= 10) || 'Name must be less than 10 characters'],
    };
  },
  computed: {
    ...mapState('orderManagement', ['parts',
      'orderTypeList',
      'addPlanDialog',
      'primaryMatrixTags',
      'orderList',
      'productDetailsList',
      'productDetails',
      'roadmapDetailsList',
      'lineList']),
    ...mapState('orderManagement', [
      'productDetailsRecord',
      'roadMapDetailsRecord',
    ]),
    ...mapGetters('orderManagement', [
      'filteredPartMatrixRecords',
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
    await this.getLines();
    this.loadingParts = false;
    this.getProductDetailsRecord('');
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
      'getProductDetailsList',
      'createBulkOrderProduct',
      'getRoadmapDetailsList',
      'createBulkOrderRoadmap',
      'getLines',
    ]),
    ...mapActions('orderManagement', [
      'getProductDetailsRecord',
      'getRoadMapDetailsRecord',
      'getProductDetails',
    ]),
    async checkProductAndRoadmapDetails(selectedPart) {
      const productObj = JSON.parse(JSON.stringify(selectedPart));
      const ProductDetailsExists = this.productDetailsRecord
        .filter((pr) => pr.productnumber === productObj.productnumber);
      if (ProductDetailsExists.length > 0) {
        this.btnDisable = false;
      } else {
        this.btnDisable = true;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'PRODUCT_ROADMAP_DETAILS_NOT_AVAILABLE',
        });
      }
    },
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
        const { productnumber } = this.selectedPart;
        const { description } = this.selectedPart;
        this.assetId = assetid;
        this.fetchingPartMatrix = true;
        await this.getPorductRecords(this.selectedPart);
        this.partMatrixRecords = this.filteredPartMatrixRecords();
        this.fetchingPartMatrix = false;
        this.plan.productname = productname;
        this.plan.productid = productnumber;
        this.plan.productiondescription = description;
        this.plan.roadmapname = this.partMatrixRecords[0].roadmapname;
        this.plan.roadmapid = this.partMatrixRecords[0].roadmapid;
        this.plan.roadmaptype = this.partMatrixRecords[0].roadmaptype;
        this.plan.customername = this.partMatrixRecords[0].customername;
        // this.plan.producttype = this.partMatrixRecords[0].producttype;
        if (this.partMatrixRecords[0].bomid) {
          this.plan.bomid = this.partMatrixRecords[0].bomid;
        } else {
          this.plan.bomid = 0;
        }
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
      } else if (!this.plan.roadmaptype) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ROADMAPTYPE_NOT_EXISTS',
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
            lineid: this.selectedLine.id,
            linename: this.selectedLine.name,
            orderstatus: 'New',
            assetid: this.assetId,
            scheduledstart: new Date(this.plan.scheduledstart).getTime(),
            ordercreatedtime: new Date().getTime(),
            visible: true,
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
            this.selectedPart = null;
            this.assetId = null;
            this.partMatrix = {};
            this.plan = {};
            this.showFamilyParts = false;
            this.displayPlanningFields = false;
            this.familyPlan = [];
            // order details in new table
            await this.getProductDetailsList(`?query=productnumber=="${this.orderList[0].productid}"`);
            const payloadDetails = [];
            this.productDetailsList.forEach((product) => {
              payloadDetails.push({
                orderid: this.orderList[0].ordernumber,
                ordername: this.orderList[0].ordername,
                productid: this.orderList[0].productid,
                recipenumber: product.recipenumber,
                recipename: product.recipename,
                recipeversion: product.recipeversion,
                substationid: product.substationid,
                lineid: this.orderList[0].lineid,
                sublineid: product.sublineid,
                assetid: 4,
              });
            });
            await this.createBulkOrderProduct(payloadDetails);
            // orderroadmap - calling roadmapdetails
            await this.getRoadmapDetailsList(`?query=roadmapid=="${this.orderList[0].roadmapid}"`);
            const payloadRoadDetails = [];
            this.roadmapDetailsList.forEach((roadmap) => {
              let processCode = 0;
              if (roadmap.process === '') {
                processCode = 0;
              } else {
                processCode = roadmap.process;
              }
              payloadRoadDetails.push({
                orderid: this.orderList[0].ordernumber,
                roadmapid: this.orderList[0].roadmapid,
                sublineid: roadmap.sublineid,
                sublinename: roadmap.sublinename,
                substationid: roadmap.substationid,
                substationname: roadmap.substationname,
                presublineid: roadmap.presublineid,
                amtpresubstation: roadmap.amtpresubstation,
                processcode: processCode,
                prestationname: roadmap.prestationname,
                prestationid: roadmap.prestationid,
                presubstationname: roadmap.presubstationname,
                presubstationid: roadmap.presubstationid,
                lineid: this.orderList[0].lineid,
                assetid: 4,
              });
            });
            await this.createBulkOrderRoadmap(payloadRoadDetails);
            this.saving = false;
            this.dialog = false;
          } else {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'ERROR_CREATING_PLAN',
            });
          }
        }
      }
    },
  },
};
</script>
