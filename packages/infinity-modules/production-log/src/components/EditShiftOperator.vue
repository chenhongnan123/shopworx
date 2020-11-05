<template>
  <v-combobox
    dense
    outlined
    label="Operator"
    hide-details
    return-object
    :items="operators"
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
import { mapState, mapActions } from 'vuex';

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
  },
  computed: {
    ...mapState('productionLog', ['operators']),
    /* selectedOperator: {
      get() {
        return this.downtime.reasonname;
      },
      set({
        reasonname,
        reasoncode,
        category,
        department,
      }) {
        const payload = {
          reasonname,
          reasoncode,
          category,
          department,
        };
        this.updateOperator({
        // eslint-disable-next-line
          id: this.downtime._id,
          payload,
        });
      },
    }, */
  },
  methods: {
    ...mapActions('productionLog', ['updateOperator']),
  },
};
</script>
