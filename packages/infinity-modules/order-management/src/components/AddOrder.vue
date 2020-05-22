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
            <template v-for="(matrixTag, index) in essentialMatrixTags">
              <v-autocomplete
                :key="index"
                class="ml-8"
                clearable
                :disabled="saving"
                :items="partMatrixRecords"
                :item-text="matrixTag.tagName"
                :item-value="matrixTag.tagName"
                @change="updatePartMatrixRecords({
                  name: matrixTag.tagName,
                  value: partMatrix[matrixTag.tagName]
                })"
                v-model="partMatrix[matrixTag.tagName]"
                :label="matrixTag.tagDescription"
              ></v-autocomplete>
            </template>
            <template v-if="message">
              <span class="ml-8">
                {{ message }}
              </span>
            </template>
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
                @change="onPlannedQtyChange"
              ></v-text-field>
              <v-text-field
                type="datetime-local"
                v-model="plan.scheduledstart"
                label="Scheduled start"
                prepend-icon="mdi-clock-start"
              ></v-text-field>
              <template v-if="isFamily">
                <div class="ml-8">
                  This is a family mold. Please select other parts to add to the plan.
                </div>
                <v-row
                  no-gutters
                  :key="`family-${n}`"
                  v-for="(family, n) in familyPlan"
                >
                  <v-col cols="12">
                    <v-checkbox
                      hide-details
                      :disabled="saving"
                      v-model="family.selected"
                      :label="family[partTag.tagName]"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      type="number"
                      class="ml-8"
                      :disabled="saving"
                      v-model="family.activecavity"
                      @change="onCavityChange(n)"
                      label="Active cavity"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      disabled
                      class="ml-2"
                      type="number"
                      v-model="family.plannedquantity"
                      label="Quantity"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <!-- <template v-if="showMore">
                <v-checkbox
                  hide-details
                  v-model="plan.starred"
                  label="Mark as star?"
                ></v-checkbox>
              </template> -->
            </template>
          </template>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn
          text
          color="primary"
          class="text-none"
          :disabled="saving"
          v-if="displayPlanningFields"
          @click="showMore = !showMore"
        >
          {{ showMore ? 'Less options': 'More options' }}
        </v-btn> -->
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
      'selectedAsset',
      'planningTags',
      'partMatrixTags',
      'filteredPartMatrixRecords',
      'partMatrixComposition',
    ]),
    isInjectionMolding() {
      let result = false;
      if (this.assetId) {
        result = this.selectedAsset(this.assetId) === 'injectionmolding';
      }
      return result;
    },
    isPress() {
      let result = false;
      if (this.assetId) {
        result = this.selectedAsset(this.assetId) === 'press';
      }
      return result;
    },
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
        // this.fetchingPartMatrix = false;
        this.partMatrixRecords = this.filteredPartMatrixRecords();
        console.log(this.partMatrixRecords[0].createdby);
        this.fetchingPartMatrix = false;
        this.plan.productname = productname;
        this.plan.roadmapname = this.partMatrixRecords[0].roadmapname;
        this.plan.customername = this.partMatrixRecords[0].customername;
        this.plan.producttype = this.partMatrixRecords[0].producttype;
        this.displayPlanningFields = true;
      }
    },
    async updatePartMatrixRecords({ name, value }) {
      if (value) {
        this.filters[name] = value;
        this.partMatrixRecords = this.filteredPartMatrixRecords(this.filters);
      } else {
        delete this.filters[name];
        this.partMatrixRecords = this.filteredPartMatrixRecords(this.filters);
      }
      if (this.partMatrixRecords.length === 1) {
        if (this.isInjectionMolding) {
          const uniqueMoldTagName = this.primaryMatrixTags
            .find((t) => t.element === 'mold')
            .tag.tagName;
          const uniqueMachineTagName = this.primaryMatrixTags
            .find((t) => t.element === 'machine')
            .tag.tagName;
          this.message = 'Checking if family mold...';
          this.isFamily = await this.isFamilyMold(
            `?query=${uniqueMoldTagName}=="${this.partMatrix[uniqueMoldTagName]}"`,
          );
          if (this.isFamily) {
            this.message = 'Fetching family parts...';
            this.familyParts = await this.getFamilyParts(
              `?query=${uniqueMoldTagName}=="${this.partMatrix[uniqueMoldTagName]}"%26%26${uniqueMachineTagName}=="${this.partMatrix[uniqueMachineTagName]}"%26%26${this.partTag.tagName}!="${this.partMatrix[this.partTag.tagName]}"`,
            );
            if (this.familyParts && this.familyParts.length) {
              this.showFamilyParts = true;
              this.familyPlan = this.familyParts.map((part) => ({
                selected: true,
                cavity: part.cavity,
                activecavity: part.cavity,
                [this.partTag.tagName]: part[this.partTag.tagName],
                plannedquantity: part.cavity * this.plan.plannedquantity,
              }));
            }
          }
          this.plan.activecavity = this.partMatrix.cavity;
        }
        const matrixKeys = Object.keys(this.partMatrix);
        matrixKeys.forEach((key) => {
          this.partMatrix[key] = this.partMatrixRecords[0][key];
        });
        this.plan.activecavity = this.partMatrix.cavity;
        this.message = null;
        this.displayPlanningFields = true;
        this.plan = { ...this.plan, ...this.partMatrix };
      } else {
        this.displayPlanningFields = false;
      }
    },
    onCavityChange(index) {
      const shots = this.plan.plannedquantity / this.plan.activecavity;
      this.familyPlan = this.familyPlan.map((p, n) => {
        let { plannedquantity } = p;
        if (n === index) {
          plannedquantity = p.activecavity * shots;
        }
        return { ...p, plannedquantity };
      });
    },
    onPlannedQtyChange() {
      if (this.showFamilyParts) {
        const shots = this.plan.plannedquantity / this.plan.activecavity;
        this.familyPlan = this.familyPlan.map((p) => ({
          ...p,
          plannedquantity: p.activecavity * shots,
        }));
      }
    },
    onActiveCavityChange() {
      if (this.showFamilyParts) {
        const shots = this.plan.plannedquantity / this.plan.activecavity;
        this.familyPlan = this.familyPlan.map((p) => ({
          ...p,
          plannedquantity: p.activecavity * shots,
        }));
      }
    },
    isExpired(expiryDate) {
      return Date.now() < (new Date(expiryDate).getTime());
    },
    async saveOrder() {
      console.log(this.plan.ordername);
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
          /* const runTime = this.plan.plannedquantity * (this.plan.stdcycletime * 1000);
          const scheduledEnd = await this.getScheduledEnd({
            start: this.plan.scheduledstart,
            end: (this.plan.scheduledstart + runTime),
          });
          this.plan.scheduledend = scheduledEnd; */
          let created = false;
          const payload = this.plan;
          console.log(payload);
          debugger;
          // await this.createOrder(payload)
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
