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
          <v-form @submit.prevent="passes(onSubmit)">
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
                <v-col cols="12">
                  <v-textarea
                      outlined
                      dense
                      label="Remarks"
                      v-model="remark"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                :disabled="invalid"
                color="primary"
                class="text-none"
                @click="saveEdit()"
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
      remark: '',
    };
  },
  computed: {
    ...mapState('productionLog', ['rejectionReasons']),
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
    async saveEdit() {
      const {
        assetid, category, department, reasoncode, reasonname,
      } = this.selectedReason;
      const data = {
        id: this.rejection._id,
        quantity: +this.rejectedQuantity,
        remark: this.remark,
        assetid,
        category,
        department,
        reasoncode,
        reasonname,
      };
      const updated = await this.updateRejection(data);
      if (updated) {
        this.dialog = false;
      }
    },
  },
};
</script>
