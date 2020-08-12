<template>
  <v-autocomplete
    dense
    outlined
    hide-details
    return-object
    :items="downtimeReasons"
    item-text="reasonname"
    item-value="reasonname"
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
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'EditDowntimeReason',
  props: {
    downtime: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('downtimeLog', ['downtimeReasons']),
    selectedReason: {
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
        this.updateReason({
        // eslint-disable-next-line
          id: this.downtime._id,
          payload,
        });
      },
    },
  },
  methods: {
    ...mapActions('downtimeLog', ['updateReason']),
  },
};
</script>
