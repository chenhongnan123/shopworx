<template>
  <v-dialog
    scrollable
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
      >
        <v-icon left>mdi-call-split</v-icon>
        Split
      </v-btn>
    </template>
    <v-card>
      <v-card-title primary-title>
        Split downtime
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
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
            <v-autocomplete
              dense
              outlined
              return-object
              label="Reason"
              :items="downtimeReasons"
              item-text="reasonname"
              item-value="reasonname"
              v-model="dt.reasonname"
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
            <v-row>
              <v-col cols="6">
                <v-text-field
                  type="time"
                  outlined
                  dense
                  step="1"
                  hide-details="auto"
                  v-model="dt.downtimestart"
                  :id="`downtimestart-${index}`"
                  label="Start time"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="time"
                  outlined
                  dense
                  step="1"
                  hide-details="auto"
                  v-model="dt.downtimeend"
                  :id="`downtimeend-${index}`"
                  label="End time"
                ></v-text-field>
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
          @click="setDowntimes"
        >
          Reset
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          :disabled="saveDisabled"
        >
          Split
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

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
  },
  data() {
    return {
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
        reasonname,
        reasoncode,
        category,
        department,
      }, {
        downtimestart: '',
        downtimeend: new Date(downtimeend).toLocaleTimeString('en-US', { hour12: false }),
        reasonname: '',
        reasoncode: '',
        category: '',
        department: '',
      }];
    },
    addDowntime() {
      this.downtimes.push({
        downtimestart: '',
        downtimeend: new Date(this.downtime.downtimeend)
          .toLocaleTimeString('en-US', { hour12: false }),
        reasonname: '',
        reasoncode: '',
        category: '',
        department: '',
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
          reasonname,
          reasoncode,
          category,
          department,
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
          reasonname,
          reasoncode,
          category,
          department,
        };
      }
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
