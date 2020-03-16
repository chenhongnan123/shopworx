<template>
  <v-card flat class="transparent">
    <v-card-text class="pa-0">
      <v-row v-if="requiredTags && requiredTags.length">
        <v-col cols="12">
          <span v-text="'Required fields'"></span>
        </v-col>
        <v-col
          cols="6"
          lg="4"
          v-for="(field, index) in requiredTags"
          :key="index"
        >
          <v-checkbox
            disabled
            hide-details
            :value="field"
            :label="field.tagDescription"
            v-model="items"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row v-if="optionalTags && optionalTags.length">
        <v-col cols="12">
          <span v-text="'Optional fields'"></span>
        </v-col>
        <v-col
          cols="6"
          lg="4"
          v-for="(field, index) in optionalTags"
          :key="index"
        >
          <v-checkbox
            hide-details
            :value="field"
            :label="field.tagDescription"
            v-model="items"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-0">
      <v-btn
        color="primary"
        class="text-none"
        @click="matchColumns"
        :class="$vuetify.theme.dark ? 'black--text' : 'white--text'"
        v-text="$t('onboarding.matchColumns.buttons.continue')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'SelectMatrixTags',
  props: {
    fields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      items: [],
    };
  },
  created() {
    this.mapItems();
  },
  watch: {
    fields() {
      this.mapItems();
    },
  },
  computed: {
    requiredTags() {
      return this.fields.filter((f) => f.required);
    },
    optionalTags() {
      return this.fields.filter((f) => !f.required);
    },
    isValidSelection() {
      return this.requiredTags.length === this.items.filter((i) => i.required).length;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    mapItems() {
      this.items = this.fields.filter((field) => field.required);
    },
    matchColumns() {
      if (!this.isValidSelection) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FIELD_MAPPING_REQUIRED',
        });
      } else {
        this.$emit('columns-matched', this.items);
      }
    },
  },
};
</script>
