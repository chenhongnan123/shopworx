<template>
  <v-responsive :max-width="280">
    <v-combobox
      dense
      filled
      hide-details
      single-line
      return-object
      :loading="loading"
      :disabled="loading"
      :items="operators"
      item-text="operatorname"
      item-value="operatorcode"
      v-model="selectedOperator"
      prepend-inner-icon="mdi-account-hard-hat"
    >
      <template #selection="data">
        {{ data.item.operatorcode }} {{ data.item.operatorname }}
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
  </v-responsive>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'AssignOperator',
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
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState('productionLog', ['operators']),
    ...mapGetters('productionLog', ['getShiftStart']),
    selectedOperator: {
      get() {
        return this.operator;
      },
      async set({
        operatorname,
        operatorcode,
      }) {
        this.loading = true;
        const payload = {
          operatorname,
          operatorcode,
          machinename: this.machine,
          timestamp: this.getShiftStart(this.shift),
          timeType: 'BUSINESS_TIME',
        };
        await this.updateOperator({
          payload,
          shift: this.shift,
          machine: this.machine,
        });
        this.loading = false;
      },
    },
  },
  methods: {
    ...mapActions('productionLog', ['updateOperator']),
  },
};
</script>
