<template>
  <v-dialog
    scrollable
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
        <v-card-title>
            REJECTIONS
        </v-card-title>
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
            <v-text-field
                outlined
                dense
                hide-details
                v-model="rejectedQuantity"
                type="number"
                label="Quantity"
            ></v-text-field>
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
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            color="primary"
            class="text-none"
            @click="saveEdit()"
            >
            <v-icon left>mdi-update</v-icon>
            Update
            </v-btn>
        </v-card-actions>
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
    //   dialog: false,
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
    this.selectedReason = this.rejection.reasonname;
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
