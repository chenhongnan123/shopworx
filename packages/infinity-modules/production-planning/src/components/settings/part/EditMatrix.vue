<template>
  <validation-observer ref="form" #default="{ handleSubmit }">
    <v-form @submit.prevent="handleSubmit(onEdit)">
      <v-card flat>
        <template v-for="(field, index) in partMatrixFields">
          <validation-provider
            :name="field.value"
            rules="required|min_value:1"
            :vid="`input-${index}`"
            :key="index"
            #default="{ errors }"
          >
            <v-text-field
              :label="field.text"
              type="number"
              :error-messages="errors"
              outlined
              dense
              :disabled="saving"
              :suffix="field.type === 'Duration' ? 'secs' : ''"
              v-model.number="matrix[field.value]"
            ></v-text-field>
          </validation-provider>
        </template>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="disabled"
            :loading="saving"
            type="submit"
            class="text-none"
            color="primary"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'EditMatrix',
  props: {
    partMatrixFields: {
      type: Array,
      required: true,
    },
    partMatrixData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      matrix: {},
      originalValue: {},
      saving: false,
    };
  },
  oldValue() {
  },
  computed: {
    disabled() {
      const isSame = JSON.stringify(this.matrix) === JSON.stringify(this.originalValue);
      return isSame;
    },
  },
  watch: {
    partMatrixData: {
      deep: true,
      immediate: true,
      handler() {
        this.matrix = this.partMatrixFields.reduce((acc, cur) => {
          acc[cur.value] = this.partMatrixData[cur.value];
          return acc;
        }, {});
        this.originalValue = { ...this.matrix };
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('productionPlanning', ['updatePartMatrix']),
    async onEdit() {
      this.saving = true;
      const payload = this.matrix;
      // eslint-disable-next-line
      const id = this.partMatrixData._id;
      const updated = await this.updatePartMatrix({ id, payload });
      if (updated) {
        this.$emit('on-edit', {
          ...this.partMatrixData,
          ...this.matrix,
        });
        this.setAlert({
          show: true,
          type: 'success',
          message: 'MATRIX_UPDATE',
        });
      } else {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'MATRIX_UPDATE',
        });
      }
      this.saving = false;
    },
  },
};
</script>
