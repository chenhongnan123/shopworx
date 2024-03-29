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
        {{ $t('production.scrapTitle') }} - {{ production.shift }} | {{ production.machinename }} |
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
            {{ $t('helper.loading') }}
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
            class="mb-2"
          >
            <!-- eslint-disable-next-line -->
            <template #item.action="{ item, index }">
              <edit-scrap
                :scrap="item"
                :updating="updating"
                :updated="updated"
                :scrapReasons="scrapReasons"
                @on-update="updateScrap"
              />
            </template>
          </v-data-table>
          <validation-observer
            ref="form"
            #default="{ handleSubmit }"
          >
            <v-form @submit.prevent="handleSubmit(addNewScrap)">
              <v-row>
                <v-col cols="12" sm="4">
                  <validation-provider
                    name="scrapWeight"
                    rules="required|min_value:0"
                    #default="{ errors }"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="mt-1"
                      type="number"
                      :label="$t('production.weight')"
                      :suffix="$t('production.kilogram')"
                      :disabled="saving"
                      hide-details="auto"
                      v-model="newScrap.weight"
                      :error-messages="errors"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="8">
                  <validation-provider
                    name="scrapReason"
                    rules="required"
                    #default="{ errors }"
                  >
                    <v-autocomplete
                      outlined
                      dense
                      class="mt-1"
                      return-object
                      :label="$t('production.reason')"
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
                    :label="$t('production.remarksOptional')"
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
                    {{ $t('production.addScrap') }}
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
import EditScrap from './EditScrap.vue';

export default {
  name: 'AssignScrap',
  props: {
    production: {
      type: Object,
      required: true,
    },
  },
  components: {
    EditScrap,
  },
  data() {
    return {
      saving: false,
      loading: false,
      dialog: false,
      updating: false,
      updated: false,
      scraps: [],
      newScrap: {
        weight: '',
        reason: '',
        remark: '',
      },
      headers: [
        { text: this.$t('production.weightInKg'), value: 'scrapweight' },
        { text: this.$t('production.reason'), value: 'reasonname' },
        { text: this.$t('production.remark'), value: 'remark' },
        { text: this.$t('production.modifiedAt'), value: 'modifiedtimestamp' },
        { text: '', value: 'action', sortable: false },
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
        scrapweight: parseFloat(weight, 10),
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
          { ...payload, _id: id, modifiedtimestamp: this.$t('production.now') },
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
      this.updating = true;
      this.updated = false;
      const { id } = item;
      let { payload } = item;
      const reason = this.scrapReasons.find((r) => r.reasonname === payload.reasonname);
      payload = { ...payload, reason };
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
          modifiedtimestamp: this.$t('production.now'),
          ...payload,
        });
        this.setAlert({
          show: true,
          type: 'success',
          message: 'SCRAP_UPDATE',
        });
        await this.reFetchProductionList();
        this.updated = true;
      } else {
        this.updated = false;
        this.setAlert({
          show: true,
          type: 'error',
          message: 'SCRAP_UPDATE',
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
