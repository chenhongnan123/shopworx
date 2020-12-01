<template>
  <validation-observer ref="form" #default="{ handleSubmit }">
    <v-form ref="form" @submit.prevent="handleSubmit(onSubmit)">
      <v-container fluid>
        <v-row
          justify="center"
          :no-gutters="$vuetify.breakpoint.smAndDown"
        >
          <v-col cols="12" xl="9" class="text-justify">
            <v-card flat class="transparent">
              <v-card-text>
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
                      Edit
                    </template>
                    <template v-else>
                      <v-icon left small>mdi-check</v-icon>
                      Done
                    </template>
                  </v-btn>
                </div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="cycletime"
                      rules="required"
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
                      rules="required"
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
                      rules="required"
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
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
                <div class="title mt-4">
                  Plan details
                </div>
                <v-row>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="quantity"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Quantity"
                        type="number"
                        :disabled="saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-package-variant-closed"
                        outlined
                        v-model="plan.plannedquantity"
                        hide-details="auto"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="scheduledstart"
                      rules="required"
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
                  <strong>Nov 23, 2020 03:22</strong>
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
                  ></v-data-table>
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
                  type="submit"
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
import { mapState, mapActions, mapGetters } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';
import { formatDate } from '@shopworx/services/util/date.service';

export default {
  name: 'AddPlan',
  data() {
    return {
      headers: [
        { text: 'Part', value: 'partname' },
        { text: 'Active cavity', value: '' },
        { text: 'Quantity', value: '' },
      ],
      editParams: false,
      savingAndExit: false,
      savingAndNew: false,
      fetchingMatrix: false,
      selectedPart: null,
      partMatrixList: [],
      familyParts: [],
      plan: null,
      selectedMachine: null,
      selectedEquipment: null,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['parts', 'partMatrix']),
    ...mapGetters('productionPlanning', ['selectedAsset']),
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
  },
  created() {
    this.initPlan();
  },
  methods: {
    ...mapActions('productionPlanning', [
      'fetchPartMatrix',
      'isFamilyMold',
      'getFamilyParts',
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
      };
    },
    clear() {
      this.initPlan();
      this.editParams = false;
      this.partMatrixList = [];
      this.familyParts = [];
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
        const {
          stdcycletime,
          delaytime,
          cavity,
          moldname,
          machinename,
          partname,
        } = this.selectedMatrix;
        console.log(cavity);
        this.plan.assetid = this.selectedPart.assetid;
        this.plan.selectedPart = partname;
        this.plan.machinename = machinename;
        this.plan.stdcycletime = stdcycletime;
        this.plan.delaytime = delaytime;
        this.plan.cavity = cavity;
        this.plan.activecavity = cavity;
        if (this.isInjectionMolding) {
          const isFamily = await this.isFamilyMold(
            `?query=moldname=="${encodeURIComponent(moldname)}"`,
          );
          if (isFamily) {
            this.familyParts = await this.getFamilyParts(
              `?query=moldname=="${encodeURIComponent(moldname)}"%26%26machinename=="${encodeURIComponent(machinename)}"%26%26partname!="${encodeURIComponent(partname)}"`,
            );
            console.log(this.familyParts);
          }
        }
      }
    },
    exit() {
      this.clear();
      this.$router.push({ name: 'productionPlanning' });
    },
  },
};
</script>
