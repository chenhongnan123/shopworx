<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="600px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        icon
        small
        v-on="on"
        color="primary"
        class="text-none mb-1"
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
        <template v-if="loading">
          <div class="text-center my-4">
            Loading...
          </div>
        </template>
        <v-expansion-panels
          v-else
          accordion
          :value="hourlyData.length - 1"
        >
          <v-expansion-panel
            v-for="(data, index) in hourlyData"
            :key="index"
          >
            <v-expansion-panel-header
              :class="data.rejections.length ? 'error--text' : 'primary--text'"
            >
              <span>
                <v-icon
                  left
                  class="primary--text"
                  :class="data.rejections.length ? 'error--text' : 'primary--text'"
                >
                  mdi-clock-outline
                </v-icon>
                {{ data.displayhour }}
              </span>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
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
                    {{ parseInt(data.rejected, 10) }}
                  </div>
                </v-col>
              </v-row>
              <v-data-table
                dense
                :headers="headers"
                hide-default-footer
                disable-pagination
                :items="data.rejections"
                v-if="data.rejections.length"
                class="mb-2"
              >
                <!-- eslint-disable-next-line -->
                <template #item.action="{ item, index }">
                  <edit-rejection
                    :hour="data.hour"
                    :rejection="item"
                    :updating="updating"
                    :updated="updated"
                    :rejectionReasons="rejectionReasons"
                    :acceptedQty="parseInt(data.produced, 10) - getRejected(data.rejections, index)"
                    @on-update="updateRejection"
                  />
                </template>
              </v-data-table>
              <validation-observer
                ref="form"
                #default="{ handleSubmit }"
              >
                <v-form @submit.prevent="handleSubmit(() => addNewRejection(data))">
                  <v-row>
                    <v-col cols="4">
                      <validation-provider
                        name="rejectedQuantity"
                        :rules="`required|numeric|min_value:1|max_value:${data.accepted}`"
                        #default="{ errors }"
                      >
                        <v-text-field
                          dense
                          outlined
                          type="number"
                          suffix="pcs"
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
import EditRejection from './EditRejection.vue';

export default {
  name: 'AssignRejections',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  components: {
    EditRejection,
  },
  data() {
    return {
      hourlyData: [],
      headers: [
        { text: 'Qty', value: 'quantity' },
        { text: 'Reason', value: 'reasonname' },
        { text: 'Remark', value: 'remark' },
        { text: 'Modified at', value: 'modifiedtimestamp' },
        { text: '', value: 'action', sortable: false },
      ],
      saving: false,
      loading: false,
      dialog: false,
      updating: false,
      updated: false,
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
    ...mapState('userDashboard', [
      'rejectionReasons',
      'machines',
      'productionList',
    ]),
    ...mapGetters('userDashboard', ['getHourStart']),
  },
  methods: {
    ...mapActions('userDashboard', [
      'fetchHourlyProduction',
      'getShiftProduction',
      'addRejection',
    ]),
    ...mapActions('element', ['updateRecordById']),
    ...mapMutations('userDashboard', ['setProductionList']),
    ...mapMutations('helper', ['setAlert']),
    getRejected(rejections, index) {
      return rejections
        .filter((r, i) => i !== index)
        .reduce((result, cur) => {
          // eslint-disable-next-line
          result += parseInt(cur.quantity, 10);
          return result;
        }, 0);
    },
    async getHourlyData() {
      this.loading = true;
      this.hourlyData = await this.fetchHourlyProduction({
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
        machinename: this.production.machinename,
        quantity: parseInt(qty, 10),
        remark,
        ...reason,
        timestamp: this.getHourStart(data.displayhour),
        timeType: 'BUSINESS_TIME',
      };
      const id = await this.addRejection(payload);
      if (id) {
        this.updateHourlyStats(payload, qty, data, id);
        this.updateShiftStats(qty);
        this.$nextTick(() => {
          this.$refs.form.forEach((f) => {
            f.reset();
          });
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
      const { rejections, rejected, produced } = this.hourlyData[index];
      const newRejectionValue = parseInt(rejected, 10) + parseInt(qty, 10);
      const rejectionsArray = [
        { ...payload, _id: id, modifiedtimestamp: 'now' },
        ...rejections,
      ];
      const newData = {
        ...this.hourlyData[index],
        rejected: newRejectionValue,
        accepted: parseInt(produced, 10) - newRejectionValue,
        rejections: rejectionsArray,
        newRejection,
      };
      this.hourlyData.splice(index, 1, newData);
    },
    updateShiftStats(rejectedQty) {
      const shiftProduction = [...this.productionList];
      const index = shiftProduction.findIndex((prod) => (
        prod.shift === this.production.shift
        && prod.machinename === this.production.machinename
        && prod.partname === this.production.partname
        && prod.planid === this.production.planid
      ));
      const rejected = parseInt(this.productionList[index].rejected, 10)
        + parseInt(rejectedQty, 10);
      const accepted = parseInt(this.productionList[index].produced, 10)
        - parseInt(rejected, 10);
      shiftProduction.splice(index, 1, {
        ...this.productionList[index],
        rejected,
        accepted,
      });
      this.setProductionList(shiftProduction);
    },
    async updateRejection(item) {
      this.updating = true;
      this.updated = false;
      const { id, hour } = item;
      let { payload } = item;
      const reason = this.rejectionReasons.find((r) => r.reasonname === payload.reasonname);
      payload = { ...payload, reason };
      const updated = await this.updateRecordById({
        elementName: 'rejection',
        id,
        payload,
      });
      if (updated) {
        const hourIndex = this.hourlyData.findIndex((d) => d.hour === hour);
        const { rejections } = this.hourlyData[hourIndex];
        // eslint-disable-next-line
        const updatedIndex = rejections.findIndex((s) => s._id === id);
        this.$set(rejections, updatedIndex, {
          ...rejections[updatedIndex],
          modifiedtimestamp: 'now',
          ...payload,
        });
        const hIndex = this.hourlyData.findIndex((d) => d.hour === hour);
        const { rejections: rej, produced } = this.hourlyData[hIndex];
        const rejected = rej.reduce((a, b) => a + (+b.quantity || 0), 0);
        const newData = {
          ...this.hourlyData[hIndex],
          rejected,
          accepted: +produced - rejected,
        };
        this.hourlyData.splice(hIndex, 1, newData);
        await this.getShiftProduction(false);
        this.updated = true;
        this.setAlert({
          show: true,
          type: 'success',
          message: 'REJECTION_UPDATE',
        });
      } else {
        this.updated = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'REJECTION_UPDATE',
        });
      }
      this.updating = false;
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
