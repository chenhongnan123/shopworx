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
        Scrap - {{ production.shift }} | {{ production.machinename }} |
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
            :items="scraps"
            disable-pagination
            v-if="scraps.length"
          >
            <!-- eslint-disable-next-line -->
            <template #item.scrapweight="{ item }">
              <v-edit-dialog
                large
                persistent
                @save="updateScrap({
                  id: item._id,
                  payload: { scrapweight: parseFloat(item.scrapweight, 10) },
                })"
                :return-value.sync="item.scrapweight"
              >
                {{ item.scrapweight }}
                <template #input>
                  <v-text-field
                    v-model="item.scrapweight"
                    type="number"
                    label="Weight (in Kg)"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.reasonname="{ item }">
              <v-edit-dialog
                large
                persistent
                @save="updateScrap({
                  id: item._id,
                  payload: { reasonname: item.reasonname },
                })"
                :return-value.sync="item.reasonname"
              >
                {{ item.reasonname }}
                <template #input>
                  <v-autocomplete
                    single-line
                    label="Reason"
                    item-text="reasonname"
                    item-value="reasonname"
                    :items="scrapReasons"
                    v-model="item.reasonname"
                  ></v-autocomplete>
                </template>
              </v-edit-dialog>
            </template>
            <!-- eslint-disable-next-line -->
            <template #item.remark="{ item }">
              <v-edit-dialog
                large
                persistent
                @save="updateScrap({
                  id: item._id,
                  payload: { remark: item.remark },
                })"
                :return-value.sync="item.remark"
              >
                {{ item.remark }}
                <template #input>
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
            <v-form @submit.prevent="handleSubmit(addNewScrap)">
              <v-row>
                <v-col cols="4">
                  <validation-provider
                    name="scrapWeight"
                    rules="required"
                    #default="{ errors }"
                  >
                    <v-text-field
                      dense
                      outlined
                      type="number"
                      label="Weight (in Kg)"
                      :disabled="saving"
                      hide-details="auto"
                      v-model="newScrap.weight"
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="8">
                  <validation-provider
                    name="scrapReason"
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
                      :items="scrapReasons"
                      v-model="newScrap.reason"
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
                    v-model="newScrap.remark"
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
                    Add scrap
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
  name: 'AssignScrap',
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
      scraps: [],
      newScrap: {
        weight: '',
        reason: '',
        remark: '',
      },
      headers: [
        { text: 'Weight (in Kg)', value: 'scrapweight' },
        { text: 'Reason', value: 'reasonname' },
        { text: 'Remark', value: 'remark' },
        { text: 'Modified at', value: 'modifiedtimestamp' },
      ],
    };
  },
  computed: {
    ...mapState('productionLog', [
      'scrapReasons',
      'machines',
      'productionList',
    ]),
    ...mapGetters('productionLog', ['getShiftStart']),
  },
  watch: {
    dialog(val) {
      if (val) {
        this.getScrap();
      }
    },
  },
  methods: {
    ...mapActions('productionLog', [
      'fetchScrap',
      'reFetchProductionList',
      'addScrap',
    ]),
    ...mapActions('element', ['updateRecordById']),
    ...mapMutations('productionLog', ['setProductionList']),
    ...mapMutations('helper', ['setAlert']),
    async getScrap() {
      this.loading = true;
      this.scraps = await this.fetchScrap({
        shift: this.production.shift,
        part: this.production.partname,
        planId: this.production.planid,
      });
      this.loading = false;
    },
    async addNewScrap() {
      this.saving = true;
      const { weight, reason, remark } = this.newScrap;
      const { assetid } = this.machines
        .find((mac) => mac.machinename === this.production.machinename);
      const payload = {
        assetid,
        planid: this.production.planid,
        partname: this.production.partname,
        machinename: this.production.machinename,
        scrapweight: weight,
        remark,
        ...reason,
        timestamp: this.getShiftStart(this.production.shift),
        timeType: 'BUSINESS_TIME',
      };
      const id = await this.addScrap(payload);
      if (id) {
        this.newScrap = {
          weight: '',
          reason: '',
          remark: '',
        };
        this.scraps = [
          { ...payload, _id: id, modifiedtimestamp: 'now' },
          ...this.scraps,
        ];
        this.updateShiftStats(weight);
        this.$nextTick(() => {
          this.$refs.form.reset();
        });
      }
      this.saving = false;
    },
    updateShiftStats(scrapWeight) {
      const shiftProduction = [...this.productionList];
      const index = shiftProduction.findIndex((prod) => (
        prod.shift === this.production.shift
        && prod.machinename === this.production.machinename
        && prod.partname === this.production.partname
        && prod.planid === this.production.planid
      ));
      const scrap = parseFloat(this.productionList[index].scrap, 10) + parseFloat(scrapWeight, 10);
      shiftProduction.splice(index, 1, {
        ...this.productionList[index],
        scrap: scrap.toFixed(2),
      });
      this.setProductionList(shiftProduction);
    },
    async updateScrap(item) {
      const { id } = item;
      let { payload } = item;
      const hasReasonNameProperty = Object.prototype.hasOwnProperty.call(payload, 'reasonname');
      const hasWeightProperty = Object.prototype.hasOwnProperty.call(payload, 'scrapweight');
      if (hasReasonNameProperty) {
        payload = this.scrapReasons.find((r) => r.reasonname === payload.reasonname);
      }
      const updated = await this.updateRecordById({
        elementName: 'scrap',
        id,
        payload,
      });
      if (updated) {
        // eslint-disable-next-line
        const updatedIndex = this.scraps.findIndex((s) => s._id === id);
        this.$set(this.scraps, updatedIndex, {
          ...this.scraps[updatedIndex],
          modifiedtimestamp: 'now',
        });
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SCRAP_UPDATE',
        });
        if (hasWeightProperty) {
          await this.reFetchProductionList();
        }
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SCRAP_UPDATE',
        });
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
