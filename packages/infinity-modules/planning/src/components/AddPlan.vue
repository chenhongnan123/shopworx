<template>
  <v-dialog
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
        <span v-if="!edit && !duplicate">
          Create plan
        </span>
        <span v-else-if="edit">
          Edit plan {{ planToEdit[0].planid }}
        </span>
        <span v-else-if="duplicate">
          Duplicate plan {{ planToEdit[0].planid }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
    <validation-observer ref="form" #default="{ handleSubmit, invalid }">
      <v-form @submit.prevent="handleSubmit(onSubmit)">
        <v-card-text>
          <validation-provider
            name="partname"
            rules="required"
            #default="{ errors }"
          >
            <v-autocomplete
              clearable
              label="Part name"
              :items="parts"
              return-object
              :error-messages="errors"
              :disabled="saving"
              item-text="partname"
              v-model="selectedPart"
              :loading="loadingParts"
              prepend-icon="$production"
              @change="onPartSelection(selectedPart)"
            >
              <template #item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.partname"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.partnumber"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </validation-provider>
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
                <validation-provider
                  :key="index"
                  :name="matrixTag.tagName"
                  rules="required"
                  #default="{ errors }"
                >
                  <v-autocomplete
                    class="ml-8"
                    clearable
                    :disabled="saving"
                    :error-messages="errors"
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
                </validation-provider>
              </template>
              <template v-if="message">
                <span class="ml-8">
                  {{ message }}
                </span>
              </template>
              <template v-if="displayPlanningFields">
                <validation-provider
                  name="plannedQuantity"
                  :rules="`required|numeric|min_value:1|multiple_of:${plan.activecavity}`"
                  #default="{ errors }"
                >
                  <v-text-field
                    type="number"
                    :disabled="saving"
                    label="Planned quantity"
                    :error-messages="errors"
                    prepend-icon="mdi-plus-minus"
                    :hint="`Qty shuould be multiple of ${plan.activecavity} (active cavities)`"
                    v-model="plan.plannedquantity"
                    @change="onPlannedQtyChange"
                  ></v-text-field>
                </validation-provider>
                <validation-provider
                  name="activeCavity"
                  :rules="`required|numeric|max_value:${plan.cavity}|min_value:1`"
                  #default="{ errors }"
                >
                  <v-text-field
                    type="number"
                    :disabled="saving"
                    :error-messages="errors"
                    v-model="plan.activecavity"
                    label="Active cavity"
                    prepend-icon="$mold"
                    :hint="`Available cavities: ${plan.cavity}`"
                    @change="onActiveCavityChange"
                  ></v-text-field>
                </validation-provider>
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
                        :readonly="family.disabled"
                        v-model="family.selected"
                        :label="family[partTag.tagName]"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider
                        name="familyActiveCavity"
                        :rules="`required|numeric|max_value:${family.cavity}|min_value:1`"
                        #default="{ errors }"
                      >
                        <v-text-field
                          type="number"
                          class="ml-8"
                          :disabled="saving"
                          :error-messages="errors"
                          v-model="family.activecavity"
                          @change="onCavityChange(n)"
                          :hint="`Available cavities: ${family.cavity}`"
                          label="Active cavity"
                        ></v-text-field>
                      </validation-provider>
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
                <validation-provider
                  name="scheduledStart"
                  rules="required|greater_than_now"
                  #default="{ errors }"
                >
                  <v-text-field
                    type="datetime-local"
                    v-model="plan.scheduledstart"
                    label="Scheduled start"
                    :error-messages="errors"
                    prepend-icon="mdi-clock-start"
                  ></v-text-field>
                </validation-provider>
                <template v-if="showMore">
                  <v-text-field
                    type="text"
                    :disabled="saving"
                    v-model="plan.workordernumber"
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
            :disabled="invalid"
            type="submit"
            v-if="!edit && !duplicate"
          >
            Save
          </v-btn>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="invalid"
            type="submit"
            v-else-if="edit"
          >
            Update
          </v-btn>
          <v-btn
            color="primary"
            class="text-none"
            :loading="saving"
            :disabled="invalid"
            type="submit"
            v-else-if="duplicate"
          >
            Duplicate
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
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
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
    duplicate: {
      type: Boolean,
      default: false,
    },
    planToEdit: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      plan: {},
      form: null,
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
  watch: {
    dialog(val) {
      if (val && (this.edit || this.duplicate)) {
        this.setPlan();
      }
    },
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
      'updatePlanById',
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
        this.familyPlan = [];
        const matrixKeys = Object.keys(this.partMatrix);
        matrixKeys.forEach((key) => {
          this.partMatrix[key] = this.partMatrixRecords[0][key];
        });
        if (this.isInjectionMolding) {
          const uniqueMoldTagName = this.primaryMatrixTags
            .find((t) => t.element === 'mold')
            .tag.tagName;
          const uniqueMachineTagName = this.primaryMatrixTags
            .find((t) => t.element === 'machine')
            .tag.tagName;
          this.message = 'Checking if family mold...';
          // TODO: check why partmatrix.moldname is empty
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
        this.plan.activecavity = this.partMatrix.cavity;
        this.plan.scheduledstart = formatDate(new Date(Math.ceil(new Date() / 9e5) * 9e5), 'yyyy-MM-dd\'T\'HH:mm');
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
        duration: runTime,
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
        this.close();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_CREATING_PLAN',
        });
      }
      this.saving = false;
    },
    async updatePlan() {
      this.saving = true;
      this.plan = {
        ...this.plan,
        planid: this.planToEdit[0].planid,
        assetid: this.assetId,
        scheduledstart: new Date(this.plan.scheduledstart).getTime(),
      };
      const runTime = (this.plan.plannedquantity / this.plan.activecavity)
        * (this.plan.stdcycletime * 1000);
      const scheduledEnd = await this.getScheduledEnd({
        start: this.plan.scheduledstart,
        duration: runTime,
      });
      this.plan.scheduledend = scheduledEnd;
      let updated = false;
      if (!this.showFamilyParts) {
        const payload = this.plan;
        /* eslint-disable no-underscore-dangle */
        updated = await this.updatePlanById({ id: this.planToEdit[0]._id, payload });
      } else {
        const familyPlans = this.familyPlan
          .filter((p) => p.selected)
          .map((p) => ({
            payload: {
              ...this.plan,
              cavity: p.cavity,
              activecavity: p.activecavity,
              plannedquantity: p.plannedquantity,
              [this.partTag.tagName]: p[this.partTag.tagName],
            },
            id: p._id,
          }));
        const plans = [{
          id: this.planToEdit[0]._id,
          payload: this.plan,
        }, ...familyPlans];
        updated = await Promise.all([plans.forEach(({ id, payload }) => {
          this.updatePlanById({ id, payload });
        })]);
      }
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PLAN_UPDATED',
        });
        this.$emit('on-add');
        this.close();
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_UPDATING_PLAN',
        });
      }
      this.saving = false;
    },
    onSubmit() {
      if (this.edit) {
        this.updatePlan();
      } else {
        this.savePlan();
      }
    },
    close() {
      this.selectedPart = null;
      this.assetId = null;
      this.partMatrix = {};
      this.plan = {};
      this.showFamilyParts = false;
      this.displayPlanningFields = false;
      this.familyPlan = [];
      requestAnimationFrame(() => {
        this.$refs.form.reset();
      });
      this.dialog = false;
    },
    async setPlan() {
      this.selectedPart = this.parts.find((part) => part.partname === this.planToEdit[0].partname);
      await this.onPartSelection();
      await this.updatePartMatrixRecords({ name: 'machinename', value: this.planToEdit[0].machinename });
      if (this.isInjectionMolding) {
        await this.updatePartMatrixRecords({ name: 'moldname', value: this.planToEdit[0].moldname });
        if (this.isFamily) {
          const familyPlansToEdit = this.planToEdit.filter((plan, index) => index !== 0);
          this.familyPlan = familyPlansToEdit
            .map((fPlan) => ({
              ...fPlan,
              selected: true,
              disabled: true,
            }));
        }
      } else if (this.isPress) {
        await this.updatePartMatrixRecords({ name: 'toolname', value: this.planToEdit[0].toolname });
      }
      this.plan = { ...this.planToEdit[0] };
      this.plan.scheduledstart = formatDate(this.planToEdit[0].scheduledstart, 'yyyy-MM-dd\'T\'HH:mm');
      if (this.duplicate) {
        delete this.plan._id;
      }
    },
  },
};
</script>
