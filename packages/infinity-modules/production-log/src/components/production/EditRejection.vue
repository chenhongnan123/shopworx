<template>
  <v-dialog
    persistent
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <template #activator="{ on }">
      <slot :on="on">
      </slot>
    </template>
    <v-card class="mt-2 pa-3">
      <template>
         <v-card-title primary-title>
          REJECTIONS
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <validation-observer ref="updateRejectionForm" #default="{ passes, invalid }">
          <v-form @submit.prevent="passes(saveEdit)">
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="8">
                  <v-autocomplete
                      outlined
                      dense
                      hide-details
                      return-object
                      :items="rejectionReasons"
                      item-text="reasonname"
                      item-value="reasonname"
                      label="Rejection reason"
                      v-model="selectedReason"
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
                </v-col>
                <v-col cols="12" sm="4">
                  <!-- // TODO - fix validation error on reset
                   -->
                  <validation-provider
                    name="rejectedQuantity"
                    :rules="`required|min_value:1|max_value:${plan.accepted}`"
                    #default="{ errors }">
                    <v-text-field
                        outlined
                        dense
                        :error-messages="errors"
                        v-model="rejectedQuantity"
                        type="number"
                        label="Quantity"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea
                      outlined
                      dense
                      label="Remarks"
                      v-model="remark"
                  ></v-textarea>
                </v-col>
                <!-- <v-col cols="12" sm="4">
                  <v-select
                    dense
                    outlined
                    v-model="rejectionHour"
                    :items="getHours(plan.shift)"
                    label="Rejection hour"
                  ></v-select>
                </v-col> -->
              </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                :disabled="invalid"
                color="primary"
                class="text-none"
                type="submit"
                :loading="saving"
                >
                <v-icon left>mdi-update</v-icon>
                Update
                </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'EditRejection',
  props: {
    rejection: {
      type: Object,
      default: () => {},
    },
    plan: {
      type: Object,
      default: () => {},
    },
    editRejection: {
      type: Boolean,
    },
  },
  data() {
    return {
      saving: false,
      message: null,
      selectedReason: null,
      rejectedQuantity: null,
      rejectionHour: 0,
      remark: '',
    };
  },
  computed: {
    ...mapState('productionLog', ['rejectionReasons', 'hours']),
    ...mapState('calendar', ['businessHours']),
    dialog: {
      get() {
        return this.editRejection;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  created() {
    this.selectedReason = this.rejectionReasons.find(
      (reason) => reason.reasonname === this.rejection.reasonname,
    );
    this.rejectedQuantity = this.rejection.quantity;
    this.remark = this.rejection.remark;
  },
  methods: {
    ...mapActions('productionLog', ['updateRejection']),
    getHours(shift) {
      const hourList = this.businessHours
        .filter((hours) => hours.shiftName === shift)
        .map((h) => h.hoursList)
        .flat();
      const hours = hourList.map((h) => ({
        text: this.hours.find((hr) => hr.sortindex === h.businessHour)
          ? this.hours.find((hr) => hr.sortindex === h.businessHour).displayhour
          : '-',
        value: h.businessHour,
      }));
      return hours;
    },
    async saveEdit() {
      this.saving = true;
      // const { day, month, year } = this.plan;
      const {
        assetid, category, department, reasoncode, reasonname,
      } = this.selectedReason;
      /* const selectedHour = this.hours.find((hr) => hr.sortindex === this.rejectionHour)
      .displayhour;
      const [start] = selectedHour.split('-');
      const [hr, mins] = start.split(':');
      const timestamp = new Date(year, (month - 1), day, parseInt(hr, 10), parseInt(mins, 10))
        .getTime();
      console.log(timestamp); */
      const data = {
        // eslint-disable-next-line
        id: this.rejection._id,
        // timestamp,
        quantity: +this.rejectedQuantity,
        remark: this.remark,
        assetid,
        category,
        department,
        reasoncode,
        reasonname,
      };
      const updated = await this.updateRejection(data);
      this.saving = false;
      if (updated) {
        this.dialog = false;
      }
    },
  },
};
</script>
