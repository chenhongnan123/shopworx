<template>
  <div>
    <!-- <v-toolbar
      flat
      :color="$vuetify.theme.dark ? '#121212': ''"
    >
      <span
        class="title font-weight-regular"
        v-text="'Production'"
      ></span>
      <v-spacer></v-spacer>
      <production-toolbar />
    </v-toolbar> -->
    <v-card flat>
      <v-fade-transition mode="out-in">
        <v-card-text
          class="text-center"
          v-if="loading"
        >
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </v-card-text>
        <!-- <v-card-text
          class="text-center"
          v-else-if="error"
        >
          Error...
        </v-card-text>
        <v-card-text
          class="text-center"
          v-else-if="plans.length === 0"
        >
          No production...
        </v-card-text> -->
        <v-card-text
          v-else
          class="pa-0"
        >
          <template v-for="(plan, i) in plans">
            <v-card
              :key="i"
              outlined
              class="mb-2"
            >
              <v-card-title primary-title>
                {{ plan.planid }}
                <v-spacer></v-spacer>
                <span class="body-1 mb-2">
                  {{ plan.cyclestart }} to {{ plan.cycleend }}
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
                      {{ plan.activecavity }}
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
                      <div class="text-uppercase warning--text title font-weight-regular mb-2">
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
                <v-expansion-panels
                  flat
                  accordion
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0 ma-0">
                      REJECTIONS
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="panel-padding">
                        <v-card class="mb-2">
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
                        <!-- <v-divider></v-divider> -->
                        <v-card class="mt-2 pa-3">
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
                                <v-text-field
                                  outlined
                                  dense
                                  hide-details
                                  v-model="rejectedQuantity"
                                  type="number"
                                  label="Quantity"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-textarea
                                  outlined
                                  dense
                                  label="Remarks"
                                  v-model="remark"
                                ></v-textarea>
                              </v-col>
                              <!-- <v-col cols="2">
                                <v-btn small icon class="error--text mt-2">
                                  <v-icon v-text="'$delete'"></v-icon>
                                </v-btn>
                              </v-col> -->
                            </v-row>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn
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
                      </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
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
// import ProductionToolbar from '../ProductionToolbar.vue';

export default {
  name: 'ProductionDetails',
  components: {
    // ProductionToolbar,
    EditRejection,
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
      return [];
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
