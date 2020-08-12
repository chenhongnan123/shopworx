<template>
  <div>
    <v-card flat>
      <v-fade-transition mode="out-in">
        <v-card-text
          class="text-center"
          v-if="loading"
        >
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-card-text>
        <v-card-text
          v-else
          class="pa-0"
        >
          <template v-if="plans" >
            <v-flex v-for="(value, name) in plans" :key="value.planid">
               <div
                :key="value.planid"
                style="border-left: 4px solid"
                class="headline pl-2 font-weight-medium"
                :class="n !== 0 ? 'my-4' : 'mb-4'"
              >
                {{ name }}
              </div>
              <template>
                <template v-for="plan in value">
                  <!-- // TODO - Move below segment to separate component/s
                  (say PlanProductionView) -->
                  <v-card
                    :key="plan.id"
                    outlined
                    class="mb-2"
                  >
                    <v-card-title primary-title>
                      {{ plan.planid }}
                      <v-spacer></v-spacer>
                      <span class="body-1 mb-2">
                        {{ plan.shift }}
                      </span>
                      <span class="body-1 mb-2"
                      v-if="plan.firstcycle && plan.firstcycle != ''">
                        , {{ plan.firstcycle }} to {{ plan.lastcycle }}
                      </span>
                    </v-card-title>
                    <v-card-subtitle primary-title>
                    </v-card-subtitle>
                    <v-card-text>
                      <v-row no-gutters >
                        <v-col cols="12" sm="8">
                          <div class="body-2">
                            Part
                          </div>
                          <div class="text-uppercase title font-weight-regular mb-2">
                            {{ plan.partname }}
                          </div>
                          <div class="body-2">
                            Active cavity
                          </div>
                          <div class="text-uppercase title font-weight-regular mb-2">
                            {{ plan.cavity }}
                          </div>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <div>
                            <div class="body-2">
                              Planned quantity
                            </div>
                            <div class="text-uppercase title font-weight-regular mb-2">
                              {{ plan.planned }}
                            </div>
                            <div class="body-2 warning--text">
                              Produced
                            </div>
                            <div class="text-uppercase
                            warning--text
                            title font-weight-regular mb-2">
                              {{ plan.produced }}
                            </div>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="2">
                          <div class="error--text">
                            <div class="body-2">
                              Rejected
                            </div>
                            <div class="text-uppercase title font-weight-regular mb-2">
                              {{ plan.rejected }}
                            </div>
                          </div>
                          <div class="success--text">
                            <div class="body-2">
                              Accepted
                            </div>
                            <div class="text-uppercase title font-weight-regular mb-2">
                              {{ plan.accepted }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                        <!-- // TODO - Auto expand by default
                         -->
                      <v-expansion-panels
                        flat
                        accordion
                      >
                        <v-expansion-panel>
                          <v-expansion-panel-header class="pa-0 ma-0">
                            REJECTIONS
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="panel-padding">
                              <!-- // TODO - Move below segment to separate component/s
                               (say RejectionView and RejectionEntry) -->
                              <v-card class="mb-2" v-if="plan.rejectionDetails.length">
                                <template>
                                  <v-data-table
                                    :headers="headers"
                                    :items="plan.rejectionDetails"
                                    hide-default-footer
                                  >
                                    <template v-slot:item.actions="{ item }">
                                        <v-row>
                                            <v-btn
                                            icon
                                            small
                                            color="primary"
                                            @click="openEdit(item, plan)"
                                            >
                                            <v-icon v-text="'$edit'"></v-icon>
                                            </v-btn>
                                            <v-btn
                                            icon
                                            small
                                            color="error"
                                            >
                                            <v-icon v-text="'$delete'"></v-icon>
                                            </v-btn>
                                        </v-row>
                                    </template>
                                  </v-data-table>
                                </template>
                              </v-card>
                              <validation-observer ref="form" #default="{ passes, invalid }">
                                <v-form @submit.prevent="passes(onSubmit)" >
                                  <v-card class="mt-2 pa-3" flat>
                                    <template>
                                      <v-row>
                                        <v-col cols="12" sm="8">
                                          <v-autocomplete
                                            outlined
                                            dense
                                            hide-details
                                            return-object
                                            :items="rejectionReasons"
                                            item-text="reasonname"
                                            item-value="reasonname"
                                            label="Rejection reason"
                                            v-model="selectedReason"
                                          >
                                            <template #selection="data">
                                              {{ data.item.reasonname }}
                                            </template>
                                            <template #item="data">
                                              <v-list-item-content>
                                                <v-list-item-title>
                                                  {{ data.item.reasonname }}
                                                </v-list-item-title>
                                                <v-list-item-subtitle
                                                  v-text="data.item.category"
                                                ></v-list-item-subtitle>
                                                <v-list-item-subtitle
                                                  v-text="data.item.department"
                                                ></v-list-item-subtitle>
                                              </v-list-item-content>
                                            </template>
                                          </v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                           <!-- // TODO - fix validation error on reset
                                            -->
                                          <validation-provider
                                          name="rejectedQuantity"
                                          :rules="`required|min_value:1|max_value:${plan.accepted}`"
                                          #default="{ errors }">
                                            <v-text-field
                                                outlined
                                                dense
                                                :error-messages="errors"
                                                v-model="rejectedQuantity"
                                                type="number"
                                                label="Quantity"
                                            ></v-text-field>
                                          </validation-provider>
                                        </v-col>
                                        <v-col cols="12">
                                          <v-textarea
                                            outlined
                                            dense
                                            label="Remarks"
                                            v-model="remark"
                                          ></v-textarea>
                                        </v-col>
                                      </v-row>
                                      <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                          :disabled="!selectedReason || invalid"
                                          color="primary"
                                          class="text-none"
                                          @click="addRejectionData(plan)"
                                        >
                                          <v-icon left>mdi-plus</v-icon>
                                          Add new
                                        </v-btn>
                                      </v-card-actions>
                                    </template>
                                  </v-card>
                                </v-form>
                              </validation-observer>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                  </v-card>
                </template>
              </template>
            </v-flex>
          </template>
          <template v-else>
            <rejection-no-records></rejection-no-records>
          </template>
        </v-card-text>
      </v-fade-transition>
    </v-card>
    <edit-rejection :rejection="dataToEdit"
    :plan="referencePlan"
    v-if="editRejection"
    :editRejection="editRejection"
    @closeDialog="editRejection = false"/>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import EditRejection from './EditRejection.vue';
import RejectionNoRecords from '../core/RejectionNoRecords.vue';

export default {
  name: 'ProductionDetails',
  components: {
    EditRejection,
    RejectionNoRecords,
  },
  data() {
    return {
      error: false,
      loading: false,
      headers: [
        { text: 'Department', value: 'department' },
        { text: 'Category', value: 'category' },
        { text: 'Reason', value: 'reasonname' },
        { text: 'Quantity', value: 'quantity' },
        { text: this.$i18n.t('displayTags.actions'), sortable: false, value: 'actions' },
      ],
      selectedReason: null,
      rejectedQuantity: null,
      remark: '',
      dataToEdit: null,
      referencePlan: null,
      editRejection: false,
    };
  },
  created() {
  },
  computed: {
    ...mapState('productionLog', ['rejectionReasons', 'selectedDate', 'selectedMachine', 'selectedShift', 'allRejections']),
    ...mapGetters('productionLog', ['planProductionData']),
    plans() {
      if (this.planProductionData) {
        return this.planProductionData;
      }
      return false;
    },
  },
  watch: {
    selectedDate(val) {
      if (val) {
        this.executeProductionReport();
      }
    },
    selectedMachine(val) {
      if (val) {
        this.executeProductionReport();
      }
    },
    selectedShift(val) {
      if (val) {
        this.executeProductionReport();
      }
    },
  },
  methods: {
    ...mapActions('productionLog', ['executeProductionReport', 'addRejection', 'updateRejection', 'getRejections']),
    async addRejectionData(plan) {
      const {
        day, date, machinename, moldname, month, partname,
        planid, planned, produced, shift, toolname, trial, year,
      } = plan;
      const {
        assetid, category, department, reasoncode, reasonname, siteId,
      } = this.selectedReason;
      const rejectionData = {
        shift,
        day,
        month,
        year,
        date,
        planid,
        machinename,
        partname,
        moldname,
        planned,
        produced,
        toolname,
        trial,
        assetid,
        category,
        department,
        reasoncode,
        reasonname,
        siteId,
        quantity: +this.rejectedQuantity,
        remark: this.remark,
      };
      const recordAdded = await this.addRejection(rejectionData);
      if (recordAdded) {
        this.rejectedQuantity = null;
        this.remark = null;
        this.selectedReason = null;
        requestAnimationFrame(() => {
          this.$refs.form.reset();
        });
      } else {
        console.error('Error while creating rejection record');
      }
    },
    openEdit(rejData, plan) {
      this.dataToEdit = rejData;
      this.referencePlan = plan;
      this.editRejection = true;
    },
  },
};
</script>

<style scoped>
.panel-padding.v-expansion-panel-content .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
