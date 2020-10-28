<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on }">
      <v-btn
        small
        v-on="on"
        color="primary"
        class="text-none"
      >
        <v-icon left>mdi-plus</v-icon>
        Rejections
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Add rejection
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="close"
          :disabled="loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <validation-observer ref="form" #default="{ passes, invalid }">
        <v-form @submit.prevent="passes(splitProduction)">
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <div class="body-2">
                  Machine
                </div>
                <div class="text-uppercase title font-weight-regular mb-2">
                  {{ production.machinename }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="body-2">
                  Shift
                </div>
                <div class="text-uppercase title font-weight-regular mb-2">
                  {{ production.shiftName }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="body-2">
                  Duration
                </div>
                <div class="text-uppercase title font-weight-regular mb-2">
                  {{ duration }}
                </div>
              </v-col>
            </v-row>
            <v-row v-for="(dt, index) in productions" :key="index">
              <v-col cols="9">
                <validation-provider
                  name="productionReason"
                  rules="required"
                  #default="{ errors }"
                >
                  <v-autocomplete
                    dense
                    outlined
                    return-object
                    label="Reason"
                    :error-messages="errors"
                    :items="productionReasons"
                    item-text="reasonname"
                    item-value="reasonname"
                    v-model="dt.selectedReason"
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
                </validation-provider>
                <v-row>
                  <v-col cols="6">
                    <validation-provider
                      name="productionStart"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-text-field
                        type="time"
                        outlined
                        dense
                        step="1"
                        :error-messages="errors"
                        :disabled="index === 0"
                        hide-details="auto"
                        v-model="dt.productionstart"
                        :id="`productionstart-${index}`"
                        label="Start time"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="6">
                    <validation-provider
                      name="productionStart"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-text-field
                        type="time"
                        outlined
                        dense
                        step="1"
                        :error-messages="errors"
                        :disabled="index === productions.length - 1"
                        hide-details="auto"
                        v-model="dt.productionend"
                        :id="`productionend-${index}`"
                        label="End time"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="3">
                <v-btn
                  icon
                  small
                  class="mx-2"
                  @click="addProduction"
                  :id="`add-${index}`"
                >
                  <v-icon v-text="'$add'"></v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  class="pa-0"
                  :id="`remove-${index}`"
                  @click="removeProduction(index)"
                  :disabled="productions.length === 1"
                >
                  <v-icon v-text="'$remove'"></v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              class="text-none"
              :disabled="loading"
              @click="setProductions"
            >
              Reset
            </v-btn>
            <v-btn
              color="primary"
              class="text-none"
              :loading="loading"
              type="submit"
              :disabled="saveDisabled || invalid"
            >
              Split
            </v-btn>
          </v-card-actions>
        </v-form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'ProductionSplit',
  props: {
    production: {
      type: Object,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      productions: [],
    };
  },
  computed: {
    ...mapState('productionLog', ['productionReasons']),
    saveDisabled() {
      return this.productions.length === 1;
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        this.setProductions();
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionLog', ['fetchProductionList']),
    ...mapActions('element', ['postRecord', 'deleteRecordById']),
    setProductions() {
      const {
        productionstart,
        productionend,
        reasonname,
        reasoncode,
        category,
        department,
      } = this.production;
      this.productions = [{
        productionstart: new Date(productionstart).toLocaleTimeString('en-US', { hour12: false }),
        productionend: '',
        selectedReason: {
          reasonname,
          reasoncode,
          category,
          department,
        },
      }, {
        productionstart: '',
        productionend: new Date(productionend).toLocaleTimeString('en-US', { hour12: false }),
        selectedReason: null,
      }];
    },
    addProduction() {
      this.productions.push({
        productionstart: '',
        productionend: new Date(this.production.productionend)
          .toLocaleTimeString('en-US', { hour12: false }),
        selectedReason: null,
      });
    },
    removeProduction(index) {
      this.productions.splice(index, 1);
      if (this.productions.length === 1 && index === 0) {
        const {
          productionstart,
          productionend,
          reasonname,
          reasoncode,
          category,
          department,
        } = this.production;
        this.productions[index] = {
          productionstart: new Date(productionstart).toLocaleTimeString('en-US', { hour12: false }),
          productionend: new Date(productionend).toLocaleTimeString('en-US', { hour12: false }),
          selectedReason: {
            reasonname,
            reasoncode,
            category,
            department,
          },
        };
      } else if (this.productions.length === 1 && index === 1) {
        const {
          productionstart,
          productionend,
          reasonname,
          reasoncode,
          category,
          department,
        } = this.production;
        this.productions[index - 1] = {
          productionstart: new Date(productionstart).toLocaleTimeString('en-US', { hour12: false }),
          productionend: new Date(productionend).toLocaleTimeString('en-US', { hour12: false }),
          selectedReason: {
            reasonname,
            reasoncode,
            category,
            department,
          },
        };
      }
    },
    close() {
      this.dialog = false;
    },
    isTimeMissing() {
      return this.productions.some((production, index) => (
        index !== this.productions.length - 1
        && production.productionend !== this.productions[index + 1].productionstart
      ));
    },
    async splitProduction() {
      this.loading = true;
      if (this.isTimeMissing()) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INVALID_DOWNTIME_SPLIT',
        });
      } else {
        const { year, month, day } = this.production;
        const productionCopy = { ...this.production };
        // eslint-disable-next-line
        delete productionCopy._id;
        await Promise.all([this.productions.forEach((dt) => {
          const [sHrs, sMins, sSecs] = dt.productionstart.split(':');
          const [eHrs, eMins, eSecs] = dt.productionend.split(':');
          const start = new Date(year, (month - 1), day, sHrs, sMins, sSecs || 0).getTime();
          const end = new Date(year, (month - 1), day, eHrs, eMins, eSecs || 0).getTime();
          const {
            reasonname,
            reasoncode,
            category,
            department,
          } = dt.selectedReason;
          const payload = {
            ...productionCopy,
            reasonname,
            reasoncode,
            category,
            department,
            productionstart: start,
            productionend: end,
            productioninms: end - start,
            productionduration: (end - start) / 1000,
            timestamp: start,
          };
          this.postRecord({
            elementName: 'production',
            payload,
          });
        })]);
        const deleted = await this.deleteRecordById({
          elementName: 'production',
          // eslint-disable-next-line
          id: this.production._id,
        });
        if (deleted) {
          await this.fetchProductionList();
          this.close();
        }
      }
      this.loading = false;
    },
  },
};
</script>
