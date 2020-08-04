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
                  expand
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="pa-0 ma-0">
                      REJECTIONS {{plan}}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="panel-padding">
                        <v-card class="mb-2">
                          <template>
                            <div>
                              <v-data-table
                                :headers="headers"
                                :items="rejectionDetails"
                              >
                                <template v-slot:item.quantity="props">
                                  <v-edit-dialog
                                    :return-value.sync="props.item.quantity"
                                    large
                                    persistent
                                    @save="save(props.item)"
                                  >
                                    <div>{{ props.item.quantity }}</div>
                                    <template v-slot:input>
                                      <div class="mt-4 title">Update Iron</div>
                                    </template>
                                    <template v-slot:input>
                                      <v-text-field
                                        v-model="props.item.quantity"
                                        type="number"
                                        label="Edit"
                                        min="0"
                                        single-line
                                        counter
                                        autofocus
                                      ></v-text-field>
                                    </template>
                                  </v-edit-dialog>
                                </template>
                              </v-data-table>

                              <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
                                {{ snackText }}

                                <template v-slot:action="{ attrs }">
                                  <v-btn v-bind="attrs" text @click="snack = false">Close</v-btn>
                                </template>
                              </v-snackbar>
                            </div>
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
                                  item-text="name"
                                  item-value="code"
                                  label="Rejection reason"
                                >
                                  <template #selection="data">
                                    {{ data.item.code }} | {{ data.item.name }}
                                  </template>
                                  <template #item="data">
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        {{ data.item.code }} | {{ data.item.name }}
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
                                  type="number"
                                  label="Quantity"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="12">
                                <v-textarea
                                  outlined
                                  dense
                                  label="Remarks"
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
                                @click="addRejectionData"
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import ProductionToolbar from '../ProductionToolbar.vue';

export default {
  name: 'ProductionDetails',
  components: {
    // ProductionToolbar,
  },
  data() {
    return {
      error: false,
      loading: false,
      headers: [
        { text: 'Reason', value: 'reasonname' },
        { text: 'Quantity', value: 'quantity' },
      ],
      rejectionDetails: [{
        planid: '100-41',
        machinename: '',
        quantity: 10,
        reasonname: 'Machine breakdown',
        remark: 'Machine under maintainance.',
      },
      {
        planid: '100-41',
        machinename: '',
        quantity: 5,
        reasonname: 'Oil change',
        remark: 'Scheduled task',
      },
      {
        planid: '100-41',
        machinename: '',
        quantity: 6,
        reasonname: 'Power outage',
      }],
      snack: false,
      snackColor: '',
      snackText: '',
    };
  },
  created() {
    // setTimeout(() => {
    //   this.executeProductionReport();
    // }, 1000);
  },
  computed: {
    ...mapState('productionLog', ['rejectionReasons', 'selectedDate', 'selectedMachine', 'selectedShift', 'productionDetails']),
    plans() {
      if (this.productionDetails) {
        this.productionDetails.forEach(async (plan) => {
          plan.rejectionDetails = await this.getRejections(plan.machinename);
          console.log('RD', plan.rejectionDetails);
        });
        debugger;
        return this.productionDetails;
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
    addRejectionData() {
      const rejectionData = {
        planid: '100-41',
        machinename: 'M1',
        partname: 'Part D',
        reasonname: 'test',
        quantity: 1,
        remark: 'test remark',
      };
      this.addRejection(rejectionData);
    },
    save(rowData) {
      const rejectionData = {
        id: rowData._id,
        quantity: 10,
      };
      this.updateRejection(rejectionData);
      this.snack = true;
      this.snackColor = 'success';
      this.snackText = 'Data saved';
    },
  },
};
</script>

<style scoped>
.panel-padding.v-expansion-panel-content .v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
