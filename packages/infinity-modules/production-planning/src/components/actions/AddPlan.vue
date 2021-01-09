<template>
  <validation-observer ref="form" #default="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onSaveAndAddNew)">
      <v-container fluid>
        <v-row
          justify="center"
          :no-gutters="$vuetify.breakpoint.smAndDown"
        >
          <v-col cols="12" xl="9" class="text-justify">
            <v-card flat class="transparent">
              <v-card-text class="pt-0">
                <v-row>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="partname"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-autocomplete
                        clearable
                        filled
                        label="Part"
                        :items="partList"
                        return-object
                        :error-messages="errors"
                        :disabled="saving"
                        item-text="partname"
                        v-model="selectedPart"
                        :title="selectedPart ? selectedPart.partname : ''"
                        @change="onPartSelection"
                      >
                        <template #item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title v-text="item.partname"></v-list-item-title>
                            <v-list-item-subtitle v-text="item.partnumber"></v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="machinename"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-autocomplete
                        clearable
                        filled
                        label="Machine"
                        :items="machineList"
                        :error-messages="errors"
                        :disabled="saving || !selectedPart"
                        :loading="fetchingMatrix"
                        item-text="machinename"
                        item-value="machinename"
                        v-model="selectedMachine"
                        :title="selectedMachine || ''"
                        @change="setPlanParameters"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="equipmentname"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-autocomplete
                        clearable
                        filled
                        label="Equipment"
                        :items="equipmentList"
                        :error-messages="errors"
                        :disabled="saving || !selectedPart"
                        :loading="fetchingMatrix"
                        item-text="equipmentname"
                        item-value="equipmentname"
                        v-model="selectedEquipment"
                        :title="selectedEquipment || ''"
                        @change="setPlanParameters"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </v-row>
                <div class="title">
                  Operational parameters
                  <v-btn
                    small
                    outlined
                    class="text-none"
                    :disabled="!selectedMatrix || saving"
                    @click="editParams = !editParams"
                    color="primary"
                  >
                    <template v-if="!editParams">
                      <v-icon left small>mdi-pencil-outline</v-icon>
                      Update
                    </template>
                    <template v-else>
                      <v-icon left small>mdi-check</v-icon>
                      Save
                    </template>
                  </v-btn>
                </div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="cycletime"
                      rules="required|min_value:1"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Cycle time"
                        type="number"
                        :disabled="!editParams || saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-clock-fast"
                        outlined
                        suffix="secs"
                        v-model="plan.stdcycletime"
                        hide-details="auto"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="delaytime"
                      rules="required|min_value:0"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Delay time"
                        type="number"
                        :disabled="!editParams || saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-cached"
                        outlined
                        suffix="secs"
                        v-model="plan.delaytime"
                        hide-details="auto"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="activecavity"
                      :rules="`required|numeric|max_value:${plan.cavity}|min_value:1`"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Active cavity"
                        type="number"
                        :disabled="!editParams || saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-tray-full"
                        outlined
                        v-model="plan.activecavity"
                        hide-details="auto"
                        @change="onCavityChange"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
                <div class="caption" v-if="areParamsEdited">
                  <span class="error--text">
                    Operational parameters are edited.
                  </span>
                  <div>
                    Standard cycletime <strong>{{ selectedMatrix.stdcycletime }}</strong> secs.
                  </div>
                  <div>
                    Standard delaytime <strong>{{ selectedMatrix.delaytime }}</strong> secs.
                  </div>
                  <div>
                    Standard cavity <strong>{{ selectedMatrix.cavity }}</strong>.
                  </div>
                </div>
                <div class="title mt-4">
                  Plan details
                </div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="quantity"
                      :rules="`required|numeric|min_value:1|multiple_of:${plan.activecavity}`"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Quantity"
                        type="number"
                        :disabled="saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-package-variant-closed"
                        outlined
                        suffix="pcs"
                        v-model="plan.plannedquantity"
                        hide-details="auto"
                        @change="onQuantityChange"
                        :hint="`Should be multiple of active cavity(${plan.activecavity})`"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="scheduledstart"
                      rules="required|greater_than_now"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Scheduled start time*"
                        type="datetime-local"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-calendar-check-outline"
                        outlined
                        v-model="plan.scheduledstart"
                        hide-details="auto"
                        :disabled="saving"
                        @change="fetchEstimatedEnd"
                      >
                        <template #append-outer>
                          <v-tooltip bottom>
                            <template #activator="{ on, attrs }">
                              <v-icon
                                v-text="'$info'"
                                v-on="on"
                                v-bind="attrs"
                              ></v-icon>
                            </template>
                            <ul>
                              <li>
                                Scheduled start time is only used in calculating
                                planned vs actual performance.
                              </li>
                              <li>
                                Updating scheduled start time will not affect
                                the execution order of the plan.
                              </li>
                              <li>
                                Plans are picked automatically in FIFO fashion.
                              </li>
                              <li>
                                To update the execution order, please visit
                                <strong>re-order plans section</strong>.
                              </li>
                            </ul>
                          </v-tooltip>
                        </template>
                      </v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="6" sm="2">
                    <v-checkbox
                      hide-details
                      label="Mark as star"
                      :disabled="saving"
                      v-model="plan.starred"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="2">
                    <v-checkbox
                      hide-details
                      label="Mark as trial"
                      :disabled="saving"
                      v-model="plan.trial"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <div>
                  *Estimated end time:
                  <strong>{{ estimatedEndDisplay }}</strong>
                </div>
                <template v-if="familyParts.length">
                  <div class="title mt-4">
                    Family mold parts
                  </div>
                    <v-data-table
                      :items="familyParts"
                      :headers="headers"
                      hide-default-footer
                      disable-pagination
                      item-key="_id"
                      show-select
                      dense
                      v-model="selectedFamilyParts"
                    >
                      <!-- eslint-disable-next-line -->
                      <template #item.activecavity="{ item }">
                        <v-responsive :max-width="100">
                          <validation-provider
                            name="familyactivecavity"
                            :vid="`cavity-${item._id}`"
                            :rules="`required|numeric|max_value:${item.cavity}|min_value:1`"
                            #default="{ errors }"
                          >
                            <v-text-field
                              v-model="item.activecavity"
                              type="number"
                              label="Active cavity"
                              :error-messages="errors"
                              single-line
                              dense
                              hide-details="auto"
                              @change="updateFamilyCavity({
                                id: item._id,
                                payload: item.activecavity,
                              })"
                            ></v-text-field>
                        </validation-provider>
                      </v-responsive>
                    </template>
                      <!-- eslint-disable-next-line -->
                      <template #item.plannedquantity="{ item }">
                        {{ item.plannedquantity }} pcs
                    </template>
                  </v-data-table>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="primary"
                  class="text-none"
                  :disabled="saving"
                  @click="exit"
                >
                  Exit
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  outlined
                  color="primary"
                  class="text-none"
                  :disabled="savingAndNew"
                  :loading="savingAndExit"
                  @click="onSaveAndExit"
                >
                  Save & Exit
                </v-btn>
                <v-btn
                  color="primary"
                  class="text-none"
                  :disabled="savingAndExit"
                  :loading="savingAndNew"
                  type="submit"
                >
                  Save & Add new
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script>
import {
  mapState, mapActions, mapGetters, mapMutations,
} from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'AddPlan',
  data() {
    return {
      headers: [
        { text: 'Part', value: 'partname' },
        { text: 'Active cavity', value: 'activecavity' },
        { text: 'Quantity', value: 'plannedquantity' },
      ],
      editParams: false,
      savingAndExit: false,
      savingAndNew: false,
      fetchingMatrix: false,
      selectedPart: null,
      partMatrixList: [],
      familyParts: [],
      selectedFamilyParts: [],
      plan: null,
      selectedMachine: null,
      selectedEquipment: null,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['parts', 'partMatrix']),
    ...mapGetters('productionPlanning', ['selectedAsset', 'partMatrixTags']),
    isInjectionMolding() {
      let result = false;
      if (this.plan && this.plan.assetid) {
        result = this.selectedAsset(this.plan.assetid) === 'injectionmolding';
      }
      return result;
    },
    isPress() {
      let result = false;
      if (this.plan && this.plan.assetid) {
        result = this.selectedAsset(this.plan.assetid) === 'press';
      }
      return result;
    },
    areParamsEdited() {
      if (this.selectedMatrix) {
        const {
          stdcycletime,
          delaytime,
          cavity,
        } = this.selectedMatrix;
        return +this.plan.stdcycletime !== stdcycletime
          || +this.plan.delaytime !== delaytime
          || +this.plan.activecavity !== cavity;
      }
      return false;
    },
    saving() {
      return this.savingAndExit || this.savingAndNew;
    },
    partList() {
      return sortArray(this.parts, 'partname');
    },
    machineList() {
      let list = [...this.partMatrixList];
      if (this.selectedEquipment) {
        list = this.partMatrixList
          .filter((val) => (val.equipmentname === this.selectedEquipment));
        return sortArray(list, 'machinename');
      }
      return sortArray(list, 'machinename');
    },
    equipmentList() {
      let list = [...this.partMatrixList];
      if (this.selectedMachine) {
        list = this.partMatrixList
          .filter((val) => (val.machinename === this.selectedMachine));
        return sortArray(list, 'equipmentname');
      }
      return sortArray(list, 'equipmentname');
    },
    estimatedEndDisplay() {
      let res = '';
      if (this.plan.scheduledend) {
        res = formatDate(
          new Date(this.plan.scheduledend),
          'dd-MM-yyyy\' \'HH:mm',
        );
      }
      return res;
    },
    selectedMatrix() {
      if (this.selectedPart && this.selectedMachine && this.selectedEquipment) {
        return this.partMatrixList.find((matrix) => (
          matrix.partname === this.selectedPart.partname
          && matrix.machinename === this.selectedMachine
          && (matrix.equipmentname === this.selectedEquipment)
        ));
      }
      return null;
    },
    shots() {
      if (this.plan.plannedquantity && this.plan.activecavity) {
        return +this.plan.plannedquantity / +this.plan.activecavity;
      }
      return 0;
    },
  },
  created() {
    this.initPlan();
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionPlanning', [
      'fetchPartMatrix',
      'isFamilyMold',
      'getFamilyParts',
      'getScheduledEnd',
      'fetchLastPlan',
      'createPlans',
    ]),
    initPlan() {
      this.plan = {
        assetid: 0,
        partname: '',
        machinename: '',
        stdcycletime: '',
        delaytime: '',
        cavity: '',
        activecavity: '',
        plannedquantity: '',
        scheduledstart: formatDate(new Date(Math.ceil(new Date() / 9e5) * 9e5), 'yyyy-MM-dd\'T\'HH:mm'),
        scheduledend: '',
        starred: false,
        trial: false,
        sortindex: 0,
        status: 'notStarted',
      };
    },
    clear() {
      this.initPlan();
      this.editParams = false;
      this.partMatrixList = [];
      this.familyParts = [];
      this.selectedFamilyParts = [];
      this.selectedMachine = null;
      this.selectedEquipment = null;
      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    async onPartSelection() {
      this.clear();
      if (this.selectedPart) {
        this.fetchingMatrix = true;
        this.partMatrixList = await this.fetchPartMatrix(this.selectedPart);
        this.fetchingMatrix = false;
      }
    },
    async setPlanParameters() {
      if (this.selectedMachine && this.selectedEquipment) {
        this.familyParts = [];
        this.selectedFamilyParts = [];
        const {
          stdcycletime,
          delaytime,
          cavity,
          moldname,
          machinename,
          partname,
        } = this.selectedMatrix;
        this.plan.assetid = this.selectedPart.assetid;
        this.plan.partname = this.selectedPart.partname;
        this.plan.machinename = machinename;
        this.plan.stdcycletime = +stdcycletime;
        this.plan.delaytime = +delaytime;
        this.plan.cavity = +cavity;
        this.plan.activecavity = +cavity;
        if (this.isInjectionMolding) {
          const isFamily = await this.isFamilyMold(
            `?query=moldname=="${encodeURIComponent(moldname)}"`,
          );
          if (isFamily) {
            const familyParts = await this.getFamilyParts(
              `?query=moldname=="${encodeURIComponent(moldname)}"%26%26machinename=="${encodeURIComponent(machinename)}"%26%26partname!="${encodeURIComponent(partname)}"`,
            );
            this.familyParts = familyParts.map((p) => ({
              ...p,
              activecavity: p.cavity,
              plannedquantity: +p.cavity * this.shots,
            }));
            this.selectedFamilyParts = [...this.familyParts];
          }
        }
      }
    },
    async fetchEstimatedEnd() {
      if (this.plan.plannedquantity && this.plan.scheduledstart) {
        const runTime = (+this.plan.plannedquantity / +this.plan.activecavity)
          * (+this.plan.stdcycletime * 1000);
        this.plan.scheduledend = await this.getScheduledEnd({
          start: new Date(this.plan.scheduledstart).getTime(),
          duration: runTime,
        });
      } else {
        this.plan.scheduledend = '';
      }
    },
    onCavityChange() {
      if (this.familyParts && this.familyParts.length) {
        this.updateFamilyParams();
      }
    },
    onQuantityChange() {
      this.fetchEstimatedEnd();
      if (this.familyParts && this.familyParts.length) {
        this.updateFamilyParams();
      }
    },
    updateFamilyParams() {
      this.familyParts = this.familyParts.map((p) => ({
        ...p,
        plannedquantity: +p.activecavity * this.shots,
      }));
    },
    updateFamilyCavity({ id, payload }) {
      // eslint-disable-next-line
      const index = this.familyParts.findIndex((p) => p._id === id);
      this.$set(this.familyParts, index, {
        ...this.familyParts[index],
        plannedquantity: +payload * this.shots,
      });
    },
    async setSortIndex() {
      const lastPlan = await this.fetchLastPlan();
      if (lastPlan) {
        this.plan.sortindex = lastPlan.sortindex + 100;
      } else {
        this.plan.sortindex = 100;
      }
    },
    exit() {
      this.clear();
      this.selectedPart = null;
      this.$router.push({ name: 'productionPlanning' });
    },
    async save() {
      await this.setSortIndex();
      const matrixTags = this.partMatrixTags(this.plan.assetid);
      const partMatrix = matrixTags.reduce((acc, cur) => {
        acc[cur.tagName] = this.selectedMatrix[cur.tagName];
        return acc;
      }, {});
      let payload = [{
        ...partMatrix,
        ...this.plan,
        scheduledstart: new Date(this.plan.scheduledstart).getTime(),
        familyName: 'family',
      }];
      if (this.selectedFamilyParts && this.selectedFamilyParts.length) {
        const familyPayload = this.selectedFamilyParts.map((p) => ({
          ...payload[0],
          cavity: p.cavity,
          activecavity: p.activecavity,
          plannedquantity: p.plannedquantity,
          partname: p.partname,
        }));
        payload = [...payload, ...familyPayload];
      }
      const created = await this.createPlans(payload);
      if (created) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'PLAN_CREATED',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'ERROR_CREATING_PLAN',
        });
      }
      return created;
    },
    async onSaveAndAddNew() {
      this.savingAndNew = true;
      const created = await this.save();
      if (created) {
        this.clear();
        this.selectedPart = null;
      }
      this.savingAndNew = false;
    },
    async onSaveAndExit() {
      const isValid = await this.$refs.form.validate();
      if (isValid) {
        this.savingAndExit = true;
        const created = await this.save();
        if (created) {
          this.exit();
        }
        this.savingAndExit = false;
      }
    },
  },
};
</script>