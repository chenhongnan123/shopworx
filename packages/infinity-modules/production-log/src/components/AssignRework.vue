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
            disable-pagination
            v-if="reworks.length"
            class="mb-2"
          >
            <!-- eslint-disable-next-line -->
            <template #item.action="{ item, index }">
              <edit-rework
                :rework="item"
                :updating="updating"
                :updated="updated"
                :reworkReasons="reworkReasons"
                :acceptedQty="parseInt(production.produced, 10) - getReworked(reworks, index)"
                @on-update="updateRework"
              />
            </template>
          </v-data-table>
          <validation-observer
            ref="form"
            #default="{ handleSubmit }"
          >
            <v-form @submit.prevent="handleSubmit(addNewRework)">
              <v-row>
                <v-col cols="12" sm="4">
                  <validation-provider
                    name="reworkQuantity"
                    :rules="`required|numeric|min_value:1|max_value:${production.accepted}`"
                    #default="{ errors }"
                  >
                    <v-text-field
                      dense
                      class="mt-1"
                      outlined
                      type="number"
                      suffix="pcs"
                      label="Quantity"
                      :disabled="saving"
                      hide-details="auto"
                      v-model="newRework.qty"
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="8">
                  <validation-provider
                    name="reworkReason"
                    rules="required"
                    #default="{ errors }"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      class="mt-1"
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
import EditRework from './EditRework.vue';

export default {
  name: 'AssignRework',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  components: {
    EditRework,
  },
  data() {
    return {
      saving: false,
      loading: false,
      dialog: false,
      updating: false,
      updated: false,
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
        { text: 'Modified at', value: 'modifiedtimestamp' },
        { text: '', value: 'action', sortable: false },
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
    getReworked(reworks, index) {
      return reworks
        .filter((r, i) => i !== index)
        .reduce((result, cur) => {
          result += parseInt(cur.reworkquantity, 10);
          return result;
        }, 0);
    },
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
        reworkquantity: parseInt(qty, 10),
        remark,
        ...reason,
        timestamp: this.getShiftStart(this.production.shift),
        timeType: 'BUSINESS_TIME',
      };
      const id = await this.addRework(payload);
      if (id) {
        this.newRework = {
          qty: '',
          reason: '',
          remark: '',
        };
        this.reworks = [
          { ...payload, _id: id, modifiedtimestamp: 'now' },
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
        && prod.planid === this.production.planid
      ));
      const rework = parseInt(this.productionList[index].rework, 10) + parseInt(reworkQty, 10);
      shiftProduction.splice(index, 1, {
        ...this.productionList[index],
        rework,
      });
      this.setProductionList(shiftProduction);
    },
    async updateRework(item) {
      this.updating = true;
      this.updated = false;
      const { id } = item;
      let { payload } = item;
      const reason = this.reworkReasons.find((r) => r.reasonname === payload.reasonname);
      payload = { ...payload, reason };
      const updated = await this.updateRecordById({
        elementName: 'rework',
        id,
        payload,
      });
      if (updated) {
        // eslint-disable-next-line
        const updatedIndex = this.reworks.findIndex((s) => s._id === id);
        this.$set(this.reworks, updatedIndex, {
          ...this.reworks[updatedIndex],
          modifiedtimestamp: 'now',
          ...payload,
        });
        this.setAlert({
          show: true,
          type: 'success',
          message: 'REWORK_UPDATE',
        });
        await this.reFetchProductionList();
        this.updated = true;
      } else {
        this.updated = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'REWORK_UPDATE',
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
