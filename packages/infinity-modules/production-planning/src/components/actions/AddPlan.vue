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
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </v-row>
                <div class="title">
                  Operational parameters
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
                        :disabled="!isMatrixSelected || saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-clock-fast"
                        outlined
                        hide-details="auto"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      name="setuptime"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-text-field
                        label="Setup time"
                        type="number"
                        :disabled="!isMatrixSelected || saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-cached"
                        outlined
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
                        :disabled="!isMatrixSelected || saving"
                        :error-messages="errors"
                        prepend-inner-icon="mdi-tray-full"
                        outlined
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
                        hide-details="auto"
                        :disabled="saving"
                      >
                        <template #append>
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
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" sm="2">
                    <v-checkbox
                      hide-details
                      label="Mark as trial"
                      :disabled="saving"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <div>
                  *Estimated end time:
                  <strong>Nov 23, 2020 03:22</strong>
                </div>
                <div class="title mt-4">
                  Family equipment parts
                </div>
                <v-data-table
                  :items="[]"
                  :headers="headers"
                  hide-default-footer
                  disable-pagination
                  item-key="_id"
                  show-select
                ></v-data-table>
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
                        hide-details="auto"
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
import { mapState, mapActions } from 'vuex';
import { sortArray } from '@shopworx/services/util/sort.service';

export default {
  name: 'AddPlan',
  data() {
    return {
      headers: [
        { text: 'Part', value: '' },
        { text: 'Active cavity', value: '' },
        { text: 'Quantity', value: '' },
      ],
      savingAndExit: false,
      savingAndNew: false,
      fetchingMatrix: false,
      selectedPart: null,
      partMatrixList: [],
      selectedMachine: null,
      selectedEquipment: null,
    };
  },
  computed: {
    ...mapState('productionPlanning', ['parts', 'partMatrix']),
    saving() {
      return this.savingAndExit || this.savingAndNew;
    },
    partList() {
      return sortArray(this.parts, 'partname');
    },
    machineList() {
      if (this.selectedEquipment) {
        const list = this.partMatrixList
          .map((val) => ({
            ...val,
            equipmentname: val.moldname || val.toolname,
          }))
          .filter((val) => (val.equipmentname === this.selectedEquipment));
        return sortArray(list, 'machinename');
      }
      return sortArray(this.partMatrixList, 'machinename');
    },
    equipmentList() {
      if (this.selectedMachine) {
        const list = this.partMatrixList
          .filter((val) => (val.machinename === this.selectedMachine))
          .map((val) => ({
            ...val,
            equipmentname: val.moldname || val.toolname,
          }));
        return sortArray(list, 'equipmentname');
      }
      const list = this.partMatrixList
        .map((val) => ({
          ...val,
          equipmentname: val.moldname || val.toolname,
        }));
      return sortArray(list, 'equipmentname');
    },
    isMatrixSelected() {
      return this.selectedPart && this.selectedMachine && this.selectedEquipment;
    },
  },
  methods: {
    ...mapActions('productionPlanning', ['fetchPartMatrix']),
    clear() {
      this.partMatrixList = [];
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
    exit() {
      this.clear();
      this.$router.push({ name: 'productionPlanning' });
    },
  },
};
</script>
