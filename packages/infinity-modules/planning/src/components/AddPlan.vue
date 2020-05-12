<template>
  <v-dialog
    scrollable
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on }">
      <slot :on="on">
      </slot>
    </template>
    <v-card>
      <v-card-title primary-title>
        <span>
          Create plan
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          clearable
          label="Part"
          :items="parts"
          return-object
          :disabled="saving"
          item-text="partname"
          v-model="selectedPart"
          :loading="loadingParts"
          prepend-icon="$production"
          @change="onPartSelection(selectedPart)"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title v-text="item.partname"></v-list-item-title>
              <v-list-item-subtitle v-text="item.partnumber"></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <template v-if="selectedPart">
          <template v-if="fetchingPartMatrix">
            <span class="ml-8">
              Fetching part matrix records...
            </span>
          </template>
          <template v-else>
            <span class="ml-8 mb-2">
              Did not find the matching part matrix? Add new <a>here</a>.
            </span>
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
                type="number"
                :disabled="saving"
                label="Planned quantity"
                prepend-icon="mdi-plus-minus"
                v-model="plan.plannedquantity"
                @change="onPlannedQtyChange"
              ></v-text-field>
              <v-text-field
                type="number"
                :disabled="saving"
                v-model="plan.activecavity"
                label="Active cavity"
                prepend-icon="$mold"
                @change="onActiveCavityChange"
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
              <v-text-field
                type="datetime-local"
                v-model="plan.scheduledstart"
                label="Scheduled start"
                prepend-icon="mdi-clock-start"
              ></v-text-field>
              <template v-if="showMore">
                <v-text-field
                  type="number"
                  :disabled="saving"
                  label="Work order number (Optional)"
                  prepend-icon="mdi-file-document-outline"
                ></v-text-field>
                <v-checkbox
                  hide-details
                  v-model="plan.trial"
                  label="Is this a trial plan?"
                ></v-checkbox>
                <v-checkbox
                  hide-details
                  v-model="plan.starred"
                  label="Mark as star?"
                ></v-checkbox>
              </template>
            </template>
          </template>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          class="text-none"
          :disabled="saving"
          v-if="displayPlanningFields"
          @click="showMore = !showMore"
        >
          {{ showMore ? 'Less options': 'More options' }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :loading="saving"
          @click="savePlan"
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
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'AddPlan',
  data() {
    return {
      plan: {},
      dialog: false,
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
    };
  },
  computed: {
    ...mapState('planning', ['parts', 'primaryMatrixTags']),
    ...mapGetters('planning', [
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
  },
  async created() {
    this.loadingParts = true;
    await this.getParts();
    this.loadingParts = false;
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('planning', [
      'getParts',
      'createPlan',
      'createFamilyPlan',
      'isFamilyMold',
      'getFamilyParts',
      'getPartMatrixRecords',
      'getPrimaryMatrixTags',
      'getScheduledEnd',
    ]),
    async onPartSelection() {
      this.plan = {};
      this.partMatrix = {};
      this.filters = {};
      this.familyPlan = [];
      this.showFamilyParts = false;
      this.displayPlanningFields = false;
      if (this.selectedPart) {
        const { assetid } = this.selectedPart;
        this.assetId = assetid;
        this.fetchingPartMatrix = true;
        await this.getPartMatrixRecords(this.selectedPart);
        this.partMatrixRecords = this.filteredPartMatrixRecords();
        await this.getPrimaryMatrixTags(assetid);
        const nonPartTags = this.primaryMatrixTags
          .filter((t) => t.element !== 'part')
          .map((t) => t.tag);
        this.partTag = this.primaryMatrixTags
          .find((t) => t.element === 'part')
          .tag;
        this.essentialMatrixTags = nonPartTags.map((tag) => ({
          tagName: tag.tagName,
          tagDescription: tag.tagDescription,
        }));
        const matrixTags = this.partMatrixTags(assetid);
        this.partMatrix = matrixTags.reduce((acc, cur) => {
          acc[cur.tagName] = '';
          return acc;
        }, {});
        this.partMatrix[this.partTag.tagName] = this.selectedPart[this.partTag.tagName];
        const tags = this.planningTags(assetid);
        this.plan = tags.reduce((acc, cur) => {
          if (cur.emgTagType === 'String') {
            acc[cur.tagName] = '';
          } else if (cur.emgTagType === 'Boolean') {
            acc[cur.tagName] = false;
          } else {
            acc[cur.tagName] = 0;
          }
          return acc;
        }, {});
        this.fetchingPartMatrix = false;
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
            `?query=${uniqueMoldTagName}=="${encodeURIComponent(this.partMatrix[uniqueMoldTagName])}"`,
          );
          if (this.isFamily) {
            this.message = 'Fetching family parts...';
            this.familyParts = await this.getFamilyParts(
              `?query=${uniqueMoldTagName}=="${encodeURIComponent(this.partMatrix[uniqueMoldTagName])}"%26%26${uniqueMachineTagName}=="${encodeURIComponent(this.partMatrix[uniqueMachineTagName])}"%26%26${this.partTag.tagName}!="${encodeURIComponent(this.partMatrix[this.partTag.tagName])}"`,
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
        this.plan.scheduledstart = formatDate(new Date(), 'yyyy-MM-dd\'T\'HH:mm');
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
    async savePlan() {
      this.saving = true;
      this.plan = {
        ...this.plan,
        status: 'notStarted',
        assetid: this.assetId,
        scheduledstart: new Date(this.plan.scheduledstart).getTime(),
      };
      const runTime = (this.plan.plannedquantity / this.plan.activecavity)
        * (this.plan.stdcycletime * 1000);
      const scheduledEnd = await this.getScheduledEnd({
        start: this.plan.scheduledstart,
        end: (this.plan.scheduledstart + runTime),
      });
      this.plan.scheduledend = scheduledEnd;
      let created = false;
      if (!this.showFamilyParts) {
        const payload = this.plan;
        created = await this.createPlan(payload);
      } else {
        const familyPlans = this.familyPlan
          .filter((p) => p.selected)
          .map((p) => ({
            ...this.plan,
            cavity: p.cavity,
            activecavity: p.activecavity,
            plannedquantity: p.plannedquantity,
            [this.partTag.tagName]: p[this.partTag.tagName],
          }));
        let payload = [this.plan, ...familyPlans];
        payload = payload.map((plan) => ({
          ...plan,
          familyName: 'family',
        }));
        created = await this.createFamilyPlan(payload);
      }
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PLAN_CREATED',
        });
        this.$emit('on-add');
        this.selectedPart = null;
        this.assetId = null;
        this.partMatrix = {};
        this.plan = {};
        this.showFamilyParts = false;
        this.displayPlanningFields = false;
        this.familyPlan = [];
        this.dialog = false;
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_CREATING_PLAN',
        });
      }
      this.saving = false;
    },
  },
};
</script>
