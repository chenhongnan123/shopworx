<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    scrollable
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
        {{ $t('downtime.split') }}
      </v-btn>
    </template>
    <v-form ref="form" v-model="isValid" @submit.prevent="splitDowntime">
      <v-card>
        <v-card-title primary-title>
          {{ $t('downtime.splitDowntime') }}
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="close"
            :disabled="loading"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <div class="body-2">
                {{ $t('downtime.machine') }}
              </div>
              <div class="text-uppercase title font-weight-regular mb-2">
                {{ downtime.machinename }}
              </div>
            </v-col>
            <v-col cols="4">
              <div class="body-2">
                {{ $t('downtime.shift') }}
              </div>
              <div class="text-uppercase title font-weight-regular mb-2">
                {{ downtime.shiftName }}
              </div>
            </v-col>
            <v-col cols="4">
              <div class="body-2">
                {{ $t('downtime.duration') }}
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
                :label="$t('downtime.reason')"
                :rules="[v => !!v || $t('downtime.validations.reasonRequired')]"
                :items="downtimeReasons"
                item-text="reasonname"
                item-value="reasonname"
                :id="`downtimereason-${index}`"
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
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    type="time"
                    outlined
                    dense
                    step="1"
                    :rules="[v => !!v || $t('downtime.validations.startTimeRequired')]"
                    :disabled="index === 0"
                    hide-details="auto"
                    v-model="dt.downtimestart"
                    :id="`downtimestart-${index}`"
                    :label="$t('downtime.startTime')"
                    @input="onStartChange(index)"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    type="time"
                    outlined
                    dense
                    step="1"
                    :rules="[v => !!v || $t('downtime.validations.endTimeRequired')]"
                    :disabled="index === downtimes.length - 1"
                    hide-details="auto"
                    v-model="dt.downtimeend"
                    :id="`downtimeend-${index}`"
                    :label="$t('downtime.endTime')"
                    @input="onEndChange(index)"
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
                :disabled="downtimes.length === 2"
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
            {{ $t('downtime.reset') }}
          </v-btn>
          <v-btn
            color="primary"
            class="text-none"
            :loading="loading"
            type="submit"
            :disabled="!isValid"
          >
            {{ $t('downtime.split') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
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
      isValid: false,
      loading: false,
      dialog: false,
      downtimes: [],
    };
  },
  computed: {
    ...mapState('downtimeLog', ['downtimeReasons']),
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
        downtimestart: new Date(downtimestart).toLocaleTimeString('en-GB'),
        downtimeend: '',
        selectedReason: reasonname ? {
          reasonname,
          reasoncode,
          category,
          department,
        } : null,
      }, {
        downtimestart: '',
        downtimeend: new Date(downtimeend).toLocaleTimeString('en-GB'),
        selectedReason: null,
      }];
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },
    onStartChange(index) {
      this.$set(
        this.downtimes,
        index - 1,
        {
          ...this.downtimes[index - 1],
          downtimeend: this.downtimes[index].downtimestart,
        },
      );
    },
    onEndChange(index) {
      this.$set(
        this.downtimes,
        index + 1,
        {
          ...this.downtimes[index + 1],
          downtimestart: this.downtimes[index].downtimeend,
        },
      );
    },
    addDowntime() {
      this.downtimes.push({
        downtimestart: '',
        downtimeend: new Date(this.downtime.downtimeend)
          .toLocaleTimeString('en-GB'),
        selectedReason: null,
      });
    },
    removeDowntime(index) {
      this.downtimes.splice(index, 1);
    },
    close() {
      this.dialog = false;
    },
    isTimeMissing() {
      const {
        year,
        month,
        day,
        downtimeinms,
      } = this.downtime;
      return this.downtimes.some((dt) => {
        const [sHrs, sMins, sSecs] = dt.downtimestart.split(':');
        const [eHrs, eMins, eSecs] = dt.downtimeend.split(':');
        const start = new Date(
          year,
          (month - 1),
          day,
          parseInt(sHrs, 10),
          parseInt(sMins, 10),
          parseInt(sSecs, 10) || 0,
        ).getTime();
        const end = new Date(
          year,
          (month - 1),
          day,
          parseInt(sHrs, 10) === 23 && parseInt(eHrs, 10) === 0
            ? 24
            : parseInt(eHrs, 10),
          parseInt(eMins, 10),
          parseInt(eSecs, 10) || 0,
        ).getTime();
        const duration = end - start;
        return duration <= 0 || duration > downtimeinms;
      });
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
          const start = new Date(year, (month - 1), day, sHrs || 24, sMins, sSecs || 0).getTime();
          const end = new Date(year, (month - 1), day, eHrs || 24, eMins, eSecs || 0).getTime();
          const {
            reasonname,
            reasoncode,
            category,
            department,
          } = dt.selectedReason;
          const durationinms = end - start < 0 ? 86400000 + (end - start) : end - start;
          const payload = {
            ...downtimeCopy,
            reasonname,
            reasoncode,
            category,
            department,
            downtimestart: start,
            downtimeend: end,
            downtimeinms: durationinms,
            downtimeduration: (durationinms) / 1000,
            timestamp: start,
            timeType: 'BUSINESS_TIME',
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
