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
        class="text-none mb-1"
      >
        <v-icon>mdi-update</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Rework - {{ production.shift }} | {{ production.machinename }} |
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
      <v-card-text>
        <template v-if="loading">
          <div class="text-center my-4">
            Loading...
          </div>
        </template>
        <template v-else>
          <v-data-table
            dense
            :headers="headers"
            hide-default-footer
            :items="reworks"
            v-if="reworks.length"
          >
            <template v-slot:item.reworkquantity="{ item }">
              <v-edit-dialog
                large
                persistent
                @save="updateRework({
                  id: item._id,
                  payload: { reworkquantity: parseInt(item.reworkquantity, 10) },
                })"
                :return-value.sync="item.reworkquantity"
              >
                {{ item.reworkquantity }}
                <template v-slot:input>
                  <v-text-field
                    v-model="item.reworkquantity"
                    type="number"
                    label="Qty"
                    :rules="[(v) => (
                      Number.isInteger(Number(v)) > 0
                      && v <= parseInt(production.accepted, 10)
                    )
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
                @save="updateRework({
                  id: item._id,
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
                    :items="reworkReasons"
                    v-model="item.reasonname"
                  ></v-autocomplete>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.remark="{ item }">
              <v-edit-dialog
                large
                persistent
                @save="updateRework({
                  id: item._id,
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
          <validation-observer
            ref="form"
            #default="{ handleSubmit }"
          >
            <v-form @submit.prevent="handleSubmit(addNewRework)">
              <v-row>
                <v-col cols="4">
                  <validation-provider
                    name="reworkQuantity"
                    :rules="`required|numeric|min_value:1|max_value:${production.accepted}`"
                    #default="{ errors }"
                  >
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Quantity"
                      :disabled="saving"
                      hide-details="auto"
                      v-model="newRework.qty"
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="8">
                  <validation-provider
                    name="reworkReason"
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
                      :items="reworkReasons"
                      v-model="newRework.reason"
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
                    v-model="newRework.remark"
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
                    Add rework
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </validation-observer>
        </template>
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
  name: 'AssignRework',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saving: false,
      loading: false,
      dialog: false,
      reworks: [],
      newRework: {
        qty: '',
        reason: '',
        remark: '',
      },
      headers: [
        { text: 'Qty', value: 'reworkquantity' },
        { text: 'Reason', value: 'reasonname' },
        { text: 'Remark', value: 'remark' },
      ],
    };
  },
  computed: {
    ...mapState('productionLog', [
      'reworkReasons',
      'machines',
      'productionList',
    ]),
    ...mapGetters('productionLog', ['getShiftStart']),
  },
  watch: {
    dialog(val) {
      if (val) {
        this.getRework();
      }
    },
  },
  methods: {
    ...mapActions('productionLog', [
      'fetchRework',
      'reFetchProductionList',
      'addRework',
    ]),
    ...mapActions('element', ['updateRecordById']),
    ...mapMutations('productionLog', ['setProductionList']),
    ...mapMutations('helper', ['setAlert']),
    async getRework() {
      this.loading = true;
      this.reworks = await this.fetchRework({
        shift: this.production.shift,
        part: this.production.partname,
        planId: this.production.planid,
      });
      this.loading = false;
    },
    async addNewRework() {
      this.saving = true;
      const { qty, reason, remark } = this.newRework;
      const { assetid } = this.machines
        .find((mac) => mac.machinename === this.production.machinename);
      const payload = {
        assetid,
        planid: this.production.planid,
        partname: this.production.partname,
        machinename: this.production.machinename,
        reworkquantity: qty,
        remark,
        ...reason,
        timestamp: this.getShiftStart(this.production.shift),
      };
      const id = await this.addRework(payload);
      if (id) {
        this.newRework = {
          qty: '',
          reason: '',
          remark: '',
        };
        this.reworks = [
          { ...payload, _id: id },
          ...this.reworks,
        ];
        this.updateShiftStats(qty);
        this.$nextTick(() => {
          this.$refs.form.reset();
        });
      }
      this.saving = false;
    },
    updateShiftStats(reworkQty) {
      const shiftProduction = [...this.productionList];
      const index = shiftProduction.findIndex((prod) => (
        prod.shift === this.production.shift
        && prod.machinename === this.production.machinename
        && prod.partname === this.production.partname
      ));
      const rework = parseInt(this.productionList[index].rework, 10) + parseInt(reworkQty, 10);
      shiftProduction.splice(index, 1, {
        ...this.productionList[index],
        rework,
      });
      this.setProductionList(shiftProduction);
    },
    async updateRework(item) {
      const { id } = item;
      let { payload } = item;
      const hasReasonNameProperty = Object.prototype.hasOwnProperty.call(payload, 'reasonname');
      const hasQtyProperty = Object.prototype.hasOwnProperty.call(payload, 'reworkquantity');
      if (hasReasonNameProperty) {
        payload = this.reworkReasons.find((r) => r.reasonname === payload.reasonname);
      }
      const updated = await this.updateRecordById({
        elementName: 'rework',
        id,
        payload,
      });
      if (updated) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'REWORK_UPDATE',
        });
        if (hasQtyProperty) {
          await this.reFetchProductionList();
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'REWORK_UPDATE',
        });
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
