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
        outlined
        color="primary"
        class="text-none"
        :disabled="inProgress"
      >
        <v-icon left>mdi-call-split</v-icon>
        Split
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Split downtime
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="close"
          :disabled="loading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <validation-observer ref="form" #default="{ handleSubmit, invalid }">
        <v-form @submit.prevent="handleSubmit(splitDowntime)">
          <v-card-text>
            <v-row>
              <v-col cols="4">
                <div class="body-2">
                  Machine
                </div>
                <div class="text-uppercase title font-weight-regular mb-2">
                  {{ downtime.machinename }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="body-2">
                  Shift
                </div>
                <div class="text-uppercase title font-weight-regular mb-2">
                  {{ downtime.shiftName }}
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
            <v-row v-for="(dt, index) in downtimes" :key="index">
              <v-col cols="9">
                <validation-provider
                  name="downtimeReason"
                  rules="required"
                  #default="{ errors }"
                >
                  <v-autocomplete
                    dense
                    outlined
                    return-object
                    label="Reason"
                    hide-details="auto"
                    :error-messages="errors"
                    :items="downtimeReasons"
                    item-text="reasonname"
                    item-value="reasonname"
                    v-model="dt.selectedReason"
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
                <v-row>
                  <v-col cols="6">
                    <validation-provider
                      name="downtimeStart"
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
                        v-model="dt.downtimestart"
                        :id="`downtimestart-${index}`"
                        label="Start time"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="6">
                    <validation-provider
                      name="downtimeStart"
                      rules="required"
                      #default="{ errors }"
                    >
                      <v-text-field
                        type="time"
                        outlined
                        dense
                        step="1"
                        :error-messages="errors"
                        :disabled="index === downtimes.length - 1"
                        hide-details="auto"
                        v-model="dt.downtimeend"
                        :id="`downtimeend-${index}`"
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
                  @click="addDowntime"
                  :id="`add-${index}`"
                >
                  <v-icon v-text="'$add'"></v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  class="pa-0"
                  :id="`remove-${index}`"
                  @click="removeDowntime(index)"
                  :disabled="downtimes.length === 1"
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
              @click="setDowntimes"
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
  name: 'DowntimeSplit',
  props: {
    downtime: {
      type: Object,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    inProgress: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      downtimes: [],
    };
  },
  computed: {
    ...mapState('downtimeLog', ['downtimeReasons']),
    saveDisabled() {
      return this.downtimes.length === 1;
    },
  },
  watch: {
    dialog(val) {
      if (val) {
        this.setDowntimes();
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('downtimeLog', ['fetchDowntimeList']),
    ...mapActions('element', ['postRecord', 'deleteRecordById']),
    setDowntimes() {
      const {
        downtimestart,
        downtimeend,
        reasonname,
        reasoncode,
        category,
        department,
      } = this.downtime;
      this.downtimes = [{
        downtimestart: new Date(downtimestart).toLocaleTimeString('en-US', { hour12: false }),
        downtimeend: '',
        selectedReason: {
          reasonname,
          reasoncode,
          category,
          department,
        },
      }, {
        downtimestart: '',
        downtimeend: new Date(downtimeend).toLocaleTimeString('en-US', { hour12: false }),
        selectedReason: null,
      }];
    },
    addDowntime() {
      this.downtimes.push({
        downtimestart: '',
        downtimeend: new Date(this.downtime.downtimeend)
          .toLocaleTimeString('en-US', { hour12: false }),
        selectedReason: null,
      });
    },
    removeDowntime(index) {
      this.downtimes.splice(index, 1);
      if (this.downtimes.length === 1 && index === 0) {
        const {
          downtimestart,
          downtimeend,
          reasonname,
          reasoncode,
          category,
          department,
        } = this.downtime;
        this.downtimes[index] = {
          downtimestart: new Date(downtimestart).toLocaleTimeString('en-US', { hour12: false }),
          downtimeend: new Date(downtimeend).toLocaleTimeString('en-US', { hour12: false }),
          selectedReason: {
            reasonname,
            reasoncode,
            category,
            department,
          },
        };
      } else if (this.downtimes.length === 1 && index === 1) {
        const {
          downtimestart,
          downtimeend,
          reasonname,
          reasoncode,
          category,
          department,
        } = this.downtime;
        this.downtimes[index - 1] = {
          downtimestart: new Date(downtimestart).toLocaleTimeString('en-US', { hour12: false }),
          downtimeend: new Date(downtimeend).toLocaleTimeString('en-US', { hour12: false }),
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
      return this.downtimes.some((downtime, index) => (
        index !== this.downtimes.length - 1
        && downtime.downtimeend !== this.downtimes[index + 1].downtimestart
      ));
    },
    async splitDowntime() {
      this.loading = true;
      if (this.isTimeMissing()) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'INVALID_DOWNTIME_SPLIT',
        });
      } else {
        const { year, month, day } = this.downtime;
        const downtimeCopy = { ...this.downtime };
        // eslint-disable-next-line
        delete downtimeCopy._id;
        await Promise.all([this.downtimes.forEach((dt) => {
          const [sHrs, sMins, sSecs] = dt.downtimestart.split(':');
          const [eHrs, eMins, eSecs] = dt.downtimeend.split(':');
          const start = new Date(year, (month - 1), day, sHrs, sMins, sSecs || 0).getTime();
          const end = new Date(year, (month - 1), day, eHrs, eMins, eSecs || 0).getTime();
          const {
            reasonname,
            reasoncode,
            category,
            department,
          } = dt.selectedReason;
          const payload = {
            ...downtimeCopy,
            reasonname,
            reasoncode,
            category,
            department,
            downtimestart: start,
            downtimeend: end,
            downtimeinms: end - start,
            downtimeduration: (end - start) / 1000,
            timestamp: start,
          };
          this.postRecord({
            elementName: 'downtime',
            payload,
          });
        })]);
        const deleted = await this.deleteRecordById({
          elementName: 'downtime',
          // eslint-disable-next-line
          id: this.downtime._id,
        });
        if (deleted) {
          await this.fetchDowntimeList();
          this.close();
        }
      }
      this.loading = false;
    },
  },
};
</script>
