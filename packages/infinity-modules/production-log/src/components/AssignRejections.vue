<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        small
        v-on="on"
        color="primary"
        class="text-none ml-4 mb-1"
      >
        <v-icon>mdi-update</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Rejection - {{ production.shift }} | {{ production.machinename }} |
        {{ production.partname }}
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="close"
          :disabled="saving"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="ma-0 pa-0">
        <template v-if="loading">Loading...</template>
        <v-expansion-panels accordion v-else>
          <v-expansion-panel
            v-for="(data,index) in hourlyData"
            :key="index"
          >
            <v-expansion-panel-header class="primary--text">
              <span>
                <v-icon left class="primary--text">mdi-clock-outline</v-icon>
                {{ data.displayhour }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <validation-observer
                ref="form"
                #default="{ handleSubmit }"
              >
                <v-form @submit.prevent="handleSubmit(addNewRejection(data))">
                  <v-row no-gutters class="text-center">
                    <v-col cols="4">
                      <div class="body-2">
                        Produced
                      </div>
                      <div class="text-uppercase title font-weight-regular mb-2 info--text">
                        {{ data.produced }}
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div class="body-2">
                        Accepted
                      </div>
                      <div class="text-uppercase title font-weight-regular mb-2 success--text">
                        {{ data.accepted }}
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div class="body-2">
                        Rejected
                      </div>
                      <div class="text-uppercase title font-weight-regular mb-2 error--text">
                        {{ data.rejected }}
                      </div>
                    </v-col>
                  </v-row>
                  <v-data-table
                    dense
                    :headers="headers"
                    hide-default-footer
                    :items="data.rejections"
                    v-if="data.rejections.length"
                  >
                    <template v-slot:item.quantity="{ item }">
                      <v-edit-dialog
                        large
                        persistent
                        @save="updateRejection({
                          id: item._id,
                          hour: data.hour,
                          payload: { quantity: item.quantity },
                        })"
                        :return-value.sync="item.quantity"
                      >
                        {{ item.quantity }}
                        <template v-slot:input>
                          <v-text-field
                            v-model="item.quantity"
                            type="number"
                            label="Qty"
                            :rules="[(v) => v <= parseInt(data.accepted, 10)
                              || 'Should be less than accepted qty']"
                            single-line
                          ></v-text-field>
                        </template>
                      </v-edit-dialog>
                    </template>
                    <template v-slot:item.reasonname="{ item }">
                      <v-edit-dialog
                        large
                        persistent
                        @save="updateRejection({
                          id: item._id,
                          hour: data.hour,
                          payload: { reasonname: item.reasonname },
                        })"
                        :return-value.sync="item.reasonname"
                      >
                        {{ item.reasonname }}
                        <template v-slot:input>
                          <v-autocomplete
                            single-line
                            label="Reason"
                            item-text="reasonname"
                            item-value="reasonname"
                            :items="rejectionReasons"
                            v-model="item.reasonname"
                          ></v-autocomplete>
                        </template>
                      </v-edit-dialog>
                    </template>
                    <template v-slot:item.remark="{ item }">
                      <v-edit-dialog
                        large
                        persistent
                        @save="updateRejection({
                          id: item._id,
                          hour: data.hour,
                          payload: { remark: item.remark },
                        })"
                        :return-value.sync="item.remark"
                      >
                        {{ item.remark }}
                        <template v-slot:input>
                          <v-textarea
                            v-model="item.remark"
                            label="Remark"
                            rows="2"
                            single-line
                          ></v-textarea>
                        </template>
                      </v-edit-dialog>
                    </template>
                  </v-data-table>
                  <v-row>
                    <v-col cols="4">
                      <validation-provider
                        name="rejectedQuantity"
                        :rules="`required|min_value:1|max_value:${data.accepted}`"
                        #default="{ errors }"
                      >
                        <v-text-field
                          dense
                          outlined
                          type="number"
                          label="Quantity"
                          :disabled="saving"
                          hide-details="auto"
                          v-model="data.newRejection.qty"
                          :error-messages="errors"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="8">
                      <validation-provider
                        name="rejectionReason"
                        rules="required"
                        #default="{ errors }"
                      >
                        <v-autocomplete
                          outlined
                          dense
                          return-object
                          label="Reason"
                          :disabled="saving"
                          hide-details="auto"
                          item-text="reasonname"
                          item-value="reasonname"
                          :error-messages="errors"
                          :items="rejectionReasons"
                          v-model="data.newRejection.reason"
                        >
                          <template #selection="data">
                            {{ data.item.reasoncode }} | {{ data.item.reasonname }}
                          </template>
                          <template #item="data">
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ data.item.reasonname }}
                              </v-list-item-title>
                              <v-list-item-subtitle
                                v-text="data.item.reasoncode"
                              ></v-list-item-subtitle>
                              <v-list-item-subtitle
                                v-text="data.item.category"
                              ></v-list-item-subtitle>
                              <v-list-item-subtitle
                                v-text="data.item.department"
                              ></v-list-item-subtitle>
                            </v-list-item-content>
                          </template>
                        </v-autocomplete>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        dense
                        rows="2"
                        outlined
                        hide-details
                        :disabled="saving"
                        label="Remarks (Optional)"
                        v-model="data.newRejection.remark"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-btn
                        block
                        type="submit"
                        color="primary"
                        :loading="saving"
                        class="text-none"
                      >
                        Add rejection
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </validation-observer>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapGetters,
  mapState,
  mapMutations,
} from 'vuex';

export default {
  name: 'AssignRejections',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      hourlyData: [],
      headers: [
        { text: 'Qty', value: 'quantity' },
        { text: 'Reason', value: 'reasonname' },
        { text: 'Remark', value: 'remark' },
      ],
      saving: false,
      loading: false,
      dialog: false,
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.getHourlyData();
      }
    },
  },
  computed: {
    ...mapState('productionLog', [
      'rejectionReasons',
      'machines',
      'productionList',
    ]),
    ...mapGetters('productionLog', ['getHourStart']),
  },
  methods: {
    ...mapActions('productionLog', [
      'fetchHourlyProduction',
      'reFetchProductionList',
      'addRejection',
    ]),
    ...mapActions('element', ['updateRecordById']),
    ...mapMutations('productionLog', ['setProductionList']),
    ...mapMutations('helper', ['setAlert']),
    async getHourlyData() {
      this.loading = true;
      this.hourlyData = await this.fetchHourlyProduction({
        machine: this.production.machinename,
        part: this.production.partname,
        shift: this.production.shift,
        planId: this.production.planid,
      });
      this.loading = false;
    },
    async addNewRejection(data) {
      this.saving = true;
      const { qty, reason, remark } = data.newRejection;
      const { assetid } = this.machines
        .find((mac) => mac.machinename === this.production.machinename);
      const payload = {
        assetid,
        planid: this.production.planid,
        partname: this.production.partname,
        machine: this.production.machinename,
        quantity: qty,
        remark,
        ...reason,
        timestamp: this.getHourStart(data.displayhour),
      };
      const id = await this.addRejection(payload);
      if (id) {
        const rejectedQty = this.updateHourlyStats(payload, qty, data, id);
        this.updateShiftStats(rejectedQty);
        this.$nextTick(() => {
          this.$refs.form[0].reset();
        });
      }
      this.saving = false;
    },
    updateHourlyStats(payload, qty, data, id) {
      const newRejection = {
        qty: '',
        reason: '',
        remark: '',
      };
      const index = this.hourlyData.findIndex((d) => d.hour === data.hour);
      const { rejections, rejected, accepted } = this.hourlyData[index];
      const newRejectionValue = rejected + parseInt(qty, 10);
      const rejectionsArray = [
        { ...payload, _id: id },
        ...rejections,
      ];
      const newData = {
        ...this.hourlyData[index],
        rejected: newRejectionValue,
        accepted: accepted - newRejectionValue,
        rejections: rejectionsArray,
        newRejection,
      };
      this.hourlyData.splice(index, 1, newData);
      return newRejectionValue;
    },
    updateShiftStats(rejectedQty) {
      const shiftProduction = [...this.productionList];
      const index = shiftProduction.findIndex((prod) => (
        prod.shift === this.production.shift
        && prod.machinename === this.production.machinename
        && prod.partname === this.production.partname
      ));
      const rejected = this.productionList[index].rejected + rejectedQty;
      const accepted = this.productionList[index].produced - rejected;
      shiftProduction.splice(index, 1, {
        ...this.productionList[index],
        rejected,
        accepted,
      });
      this.setProductionList(shiftProduction);
    },
    async updateRejection(item) {
      const { id, hour } = item;
      let { payload } = item;
      const hasReasonNameProperty = Object.prototype.hasOwnProperty.call(payload, 'reasonname');
      const hasQtyProperty = Object.prototype.hasOwnProperty.call(payload, 'quantity');
      if (hasReasonNameProperty) {
        payload = this.rejectionReasons.find((r) => r.reasonname === payload.reasonname);
      }
      const updated = await this.updateRecordById({
        elementName: 'rejection',
        id,
        payload,
      });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'REJECTION_UPDATE_SUCCESS',
        });
        if (hasQtyProperty) {
          const hIndex = this.hourlyData.findIndex((d) => d.hour === hour);
          const { rejections, produced } = this.hourlyData[hIndex];
          const rejected = rejections.reduce((a, b) => a + (b.quantity || 0), 0);
          const newData = {
            ...this.hourlyData[hIndex],
            rejected,
            accepted: produced - rejected,
          };
          this.hourlyData.splice(hIndex, 1, newData);
          await this.reFetchProductionList();
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'REJECTION_UPDATE_ERROR',
        });
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
