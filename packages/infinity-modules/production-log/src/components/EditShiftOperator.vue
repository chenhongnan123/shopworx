<template>
  <v-combobox
    dense
    outlined
    label="Operator"
    hide-details
    return-object
    :items="operators"
    v-model="selectedOperator"
    item-text="operatorname"
    item-value="operatorcode"
    prepend-inner-icon="mdi-account-hard-hat"
  >
    <template #selection="data">
      {{ data.item.operatorcode }} | {{ data.item.operatorname }}
    </template>
    <template #item="data">
      <v-list-item-content>
        <v-list-item-title>
          {{ data.item.operatorname }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ data.item.operatorcode }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-combobox>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'EditShiftOperator',
  props: {
    shift: {
      type: String,
      required: true,
    },
    machine: {
      type: String,
      required: true,
    },
    operator: {
      type: Object,
    },
  },
  computed: {
    ...mapState('productionLog', ['operators']),
    ...mapGetters('productionLog', ['getTimestamp']),
    selectedOperator: {
      get() {
        return this.operator;
      },
      set({
        operatorname,
        operatorcode,
      }) {
        const payload = {
          operatorname,
          operatorcode,
          machinename: this.machine,
          timestamp: this.getTimestamp(this.shift),
        };
        this.updateOperator({
          payload,
          shift: this.shift,
          machine: this.machine,
        });
      },
    },
  },
  methods: {
    ...mapActions('productionLog', ['updateOperator']),
  },
};
</script>
