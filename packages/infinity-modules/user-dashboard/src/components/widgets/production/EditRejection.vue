<template>
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="500px"
    transition="dialog-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        icon
        small
        v-on="on"
        v-bind="attrs"
      >
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
    </template>
    <v-form v-model="isValid" @submit.prevent="$emit('on-update', {
      id: item._id,
      hour,
      payload: {
        quantity: item.quantity,
        reasonname: item.reasonname,
        remark: item.remark,
      },
    })">
      <v-card>
        <v-card-title class="title font-weight-regular justify-space-between">
          {{ $t('editRejection') }}
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="py-0" v-if="item">
          <v-text-field
            v-model.number="item.quantity"
            type="number"
            :label="$t('qty')"
            outlined
            dense
            class="mt-1"
            suffix="pcs"
            :rules="[(v) => (
              Number.isInteger(Number(v)) > 0
              && parseInt(v, 10) <= acceptedQty
            )
              || $t('validations.rejected')]"
          ></v-text-field>
          <v-autocomplete
            outlined
            dense
            :label="$t('reason')"
            :disabled="updating"
            item-text="reasonname"
            item-value="reasonname"
            :items="rejectionReasons"
            v-model="item.reasonname"
            :rules="[(v) => !!v || $t('validations.reasonRequired')]"
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
          <v-textarea
            v-model="item.remark"
            :label="$t('remark')"
            rows="2"
            outlined
            dense
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            type="submit"
            color="primary"
            :disabled="!isValid"
            :loading="updating"
            class="text-none"
          >
            {{ $t('updateRejection') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: 'EditRejection',
  props: {
    rejection: {
      type: Object,
      required: true,
    },
    acceptedQty: {
      type: Number,
      default: 0,
    },
    hour: {
      type: [Number, String],
      default: 0,
    },
    rejectionReasons: {
      type: Array,
      default: () => [],
    },
    updating: {
      type: Boolean,
      default: false,
    },
    updated: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      item: {},
      isValid: false,
      dialog: false,
    };
  },
  watch: {
    dialog(val) {
      if (val) {
        this.item = { ...this.rejection };
      }
    },
    updated(val) {
      if (val) {
        this.dialog = false;
      }
    },
  },
};
</script>
